import { UndefinedDependencyException } from '../exceptions';
import { Reflector } from '../reflection';
import { ProviderToken, Type, isForwardReference, isFunction } from '../types';
import { Context } from './constants';
import { Instance, InstanceWrapper } from './instance-wrapper';
import { Module } from './module';

export class InstanceCreator<T = any> {
  constructor(private readonly wrapper: InstanceWrapper<T>) {}

  public async create(ctx: Context): Promise<Instance<T>> {
    const instance = this.wrapper.getInstance(ctx);

    if (instance.isResolved) {
      return instance;
    }

    const dependencies = await this.resolveDependencies(ctx);
    return await this.createInstance(ctx, dependencies);
  }

  private async resolveDependencies(ctx: Context): Promise<Array<any>> {
    const { inject, metatype } = this.wrapper;

    // If inject != null we have a factory provider, so no class to instantiate
    const dependencies = inject != null ? inject : Reflector.getConstructorDependencies(metatype);

    // TODO: Add support for params marked with the @optional decorator
    // @ts-ignore
    const optionalDependencies = [];

    return await Promise.all(
      dependencies.map(async (dep) => {
        const wrapper = await this.resolveDependency(ctx, dep);
        return wrapper.getInstance(ctx).value;
      }),
    );
  }

  private async resolveDependency(ctx: Context, dep?: ProviderToken): Promise<InstanceWrapper> {
    if (dep == null) {
      throw new UndefinedDependencyException();
    }

    const token = isForwardReference(dep) ? dep.forwardRef() : dep;
    const name = isFunction(token) ? token.name : token;
    const { providers } = this.wrapper.host;

    // It's a direct provider
    if (providers.has(name)) {
      const wrapper = providers.get(name)!;
      await wrapper.createInstance(ctx);
      return wrapper;
    }
    // It's a provider from an imported module
    else {
      const wrapper = await this.resolveFromImports(ctx, name);

      if (wrapper == null) {
        throw new UndefinedDependencyException(name, this.wrapper.name);
      }

      await wrapper.createInstance(ctx);
      return wrapper;
    }
  }

  private async resolveFromImports(
    ctx: Context,
    name: string,
    visited: Array<string> = [],
    module: Module = this.wrapper.host,
  ): Promise<InstanceWrapper | undefined> {
    let searchedWrapper: InstanceWrapper | undefined;

    const { imports } = module;

    for (const importedModule of imports) {
      if (!visited.includes(importedModule.id)) {
        visited.push(importedModule.id);

        const { providers, exports } = importedModule;
        if (!exports.has(name)) {
          searchedWrapper = await this.resolveFromImports(ctx, name, visited, importedModule);

          if (searchedWrapper != null) {
            return searchedWrapper;
          }
        }

        return providers.get(name);
      }
    }

    return searchedWrapper;
  }

  private async createInstance(context: Context, dependencies: Array<any>): Promise<Instance<T>> {
    const { metatype: Metatype, inject } = this.wrapper;
    const ctxInstance = this.wrapper.getInstance(context)!;

    if (inject != null) {
      // we have a factory to instantiate
      const instance = await (this.wrapper.metatype as Function)(...dependencies);
      ctxInstance.value = instance;
      ctxInstance.isResolved = true;
      return ctxInstance;
    } else {
      // We have a class to instantiate
      const instance = new (Metatype as Type<T>)(...dependencies);
      ctxInstance.value = instance;
      ctxInstance.isResolved = true;
      return ctxInstance;
    }
  }
}
