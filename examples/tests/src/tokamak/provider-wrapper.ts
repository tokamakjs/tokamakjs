import { CircularDependencyException, UndefinedDependencyException } from './exceptions';
import { DEFAULT_INJECTION_CONTEXT, Scope } from './injection-context';
import { Module } from './module';
import { Reflector } from './reflection';
import {
  Class,
  InjectionContext,
  Provider,
  Token,
  isClass,
  isClassProvider,
  isFactoryProvider,
  isValueProvider,
} from './types';
import { run } from './utils';
import { runHooks } from './utils/hooks';

export class ProviderWrapper<T> {
  private readonly _provider: Exclude<Provider<T>, Class<T>>;
  private readonly _instances: Map<InjectionContext, T> = new Map();

  constructor(private readonly _hostModule: Module, provider: Provider<T>) {
    if (isClass(provider)) {
      const { scope } = Reflector.getProviderMetadata(provider);
      this._provider = { useClass: provider, scope, provide: provider };
    } else {
      this._provider = provider;
    }
  }

  get isTransient() {
    return this._provider.scope === Scope.TRANSIENT;
  }

  get dependencies() {
    if (isClassProvider(this._provider)) {
      return Reflector.getConstructorDependencies(this._provider.useClass);
    } else if (isValueProvider(this._provider)) {
      return [];
    } else {
      return this._provider.inject ?? [];
    }
  }

  get name() {
    return typeof this._provider.provide === 'function'
      ? this._provider.provide.name
      : this._provider.provide.toString();
  }

  get key() {
    return this._provider.provide;
  }

  public async callOnInit(): Promise<void> {
    const inst = this.getSingleton();
    runHooks(inst, 'onModuleInit');
  }

  public async callOnDidInit(): Promise<void> {
    const inst = this.getSingleton();
    runHooks(inst, 'onModuleDidInit');
  }

  public async createInstance(): Promise<T> {
    return await this._createInstance(DEFAULT_INJECTION_CONTEXT);
  }

  public getSingleton(): T {
    const value = this._instances.get(DEFAULT_INJECTION_CONTEXT);

    if (value == null) {
      // This should never happen as we always create the DEFAULT_INJECTION_CONTEXT
      throw new Error();
    }

    return value;
  }

  public async getInstance(context: InjectionContext): Promise<T> {
    if (!this.isTransient) {
      return this.getSingleton();
    }

    const value = this._instances.get(context);

    if (value != null) {
      return value;
    }

    return await this._createInstance(context);
  }

  private async _createInstance(context: InjectionContext): Promise<T> {
    if (this._instances.has(context)) {
      return this._instances.get(context)!;
    }

    const deps = await this._resolveDependencies(context);

    // Do this again in case we created the instance when
    // resolving dependencies
    if (this._instances.has(context)) {
      return this._instances.get(context)!;
    }

    const inst: T = await run(async () => {
      if (isClassProvider(this._provider)) {
        const { useClass: Class } = this._provider;
        return new Class(...deps);
      } else if (isValueProvider(this._provider)) {
        return this._provider.useValue;
      } else if (isFactoryProvider(this._provider)) {
        const { inject, useFactory: fn } = this._provider;
        return await fn(...(inject ?? []));
      }
    });

    this._instances.set(context, inst);
    return inst;
  }

  private async _resolveDependencies(context: InjectionContext): Promise<Array<unknown>> {
    // TODO: Add support for optional dependencies marked with @optional
    const optionalDependencies = [] as Array<Token>;

    const resolvedDependencies = [] as Array<unknown>;

    for (const dep of [...this.dependencies, ...optionalDependencies]) {
      const depWrapper = await this._resolveDependency(context, dep);
      await depWrapper._createInstance(context);
      const depValue = await depWrapper.getInstance(context);
      resolvedDependencies.push(depValue);
    }

    return resolvedDependencies;
  }

  private async _resolveDependency(
    context: InjectionContext,
    dependency: Token,
  ): Promise<ProviderWrapper<unknown>> {
    if (dependency == null) {
      throw new CircularDependencyException(this.name);
    }

    const { providers } = this._hostModule;
    let depWrapper: ProviderWrapper<unknown> | undefined;

    // It's a direct provider
    if (providers.has(dependency)) {
      depWrapper = providers.get(dependency);
    }

    // Try to resolve from imported modules
    if (depWrapper == null) {
      depWrapper = await this._resolveFromImports(context, dependency);
    }

    // If wrapper is still null, try to resolve from the global module
    if (depWrapper == null) {
      depWrapper = this._hostModule.container?.globalModule.providers.get(dependency);
    }

    // At this point, we tried to resolve from any possible place
    if (depWrapper == null) {
      const name = typeof dependency === 'function' ? dependency.name : dependency.toString();
      throw new UndefinedDependencyException(name, this.name);
    }

    return depWrapper;
  }

  private async _resolveFromImports(
    context: InjectionContext,
    token: Token,
    visited: Array<Module> = [],
    module: Module = this._hostModule,
  ): Promise<ProviderWrapper<unknown> | undefined> {
    const { imports } = module;

    for (const importedModule of imports) {
      if (!visited.includes(importedModule)) {
        visited.push(importedModule);
        const { exports, providers } = importedModule;

        if (exports.includes(token) && !providers.has(token)) {
          throw new Error(
            'Exported provided not found. Make sure it is added to the providers array.',
          );
        }

        if (exports.includes(token)) {
          return providers.get(token);
        } else {
          const wrapper = await this._resolveFromImports(context, token, visited, importedModule);
          if (wrapper != null) return wrapper;
        }
      }
    }
  }
}
