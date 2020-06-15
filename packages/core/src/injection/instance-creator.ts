import { UndefinedDependencyException } from '../exceptions';
import { Reflector } from '../reflection';
import { Constructor, isFunction } from '../utils';
import { Context } from './constants';
import { isForwardReference } from './forward-ref';
import { Instance, InstanceWrapper } from './instance-wrapper';
import { Module } from './module';
import { ProviderToken } from './provider';

export class InstanceCreator<T = any> {
  constructor(private readonly wrapper: InstanceWrapper<T>) {}

  public async create(ctx: Context): Promise<Instance<T>> {
    const instance = this.wrapper.getInstance(ctx);

    if (instance.isResolved) {
      return instance;
    }

    const dependencies = await this._resolveDependencies(ctx);
    return await this._createInstance(ctx, dependencies);
  }

  private async _resolveDependencies(ctx: Context): Promise<Array<any>> {
    const { inject, metatype } = this.wrapper;

    // If inject != null we have a factory provider, so no class to instantiate
    const dependencies = inject != null ? inject : Reflector.getConstructorDependencies(metatype);

    // TODO: Add support for params marked with the @optional decorator
    // @ts-ignore
    const optionalDependencies = [] as Array<any>;

    const resolvedDependencies = [] as Array<any>;

    for (const dep of [...dependencies, ...optionalDependencies]) {
      const wrapper = await this._resolveDependency(ctx, dep);
      resolvedDependencies.push(wrapper.getInstance(ctx).value);
    }

    return resolvedDependencies;
  }

  private async _resolveDependency(ctx: Context, dep?: ProviderToken): Promise<InstanceWrapper> {
    if (dep == null) {
      throw new UndefinedDependencyException();
    }

    const token = isForwardReference(dep) ? dep.forwardRef() : dep;
    const name = isFunction(token) ? token.name : token;
    const { providers } = this.wrapper.host;

    let wrapper: InstanceWrapper<unknown> | undefined;

    // It's a direct provider
    if (providers.has(name)) {
      wrapper = providers.get(name);
    }

    // Try to resolve from the imported modules
    if (wrapper == null) {
      wrapper = await this._resolveFromImports(ctx, name);
    }

    // If wrapper is still null, try to resolve from the global module
    if (wrapper == null) {
      wrapper = this.wrapper.host.container?.globalModule.providers.get(name);
    }

    // At this point, we tried to resolve from any possible place
    if (wrapper == null) {
      throw new UndefinedDependencyException(name, this.wrapper.name);
    }

    await wrapper.createInstance(ctx);
    return wrapper;
  }

  private async _resolveFromImports(
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
          searchedWrapper = await this._resolveFromImports(ctx, name, visited, importedModule);

          if (searchedWrapper != null) {
            return searchedWrapper;
          }
        } else {
          return providers.get(name);
        }
      }
    }

    return searchedWrapper;
  }

  private async _createInstance(context: Context, dependencies: Array<any>): Promise<Instance<T>> {
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
      const instance = new (Metatype as Constructor<T>)(...dependencies);
      ctxInstance.value = instance;
      ctxInstance.isResolved = true;
      return ctxInstance;
    }
  }
}
