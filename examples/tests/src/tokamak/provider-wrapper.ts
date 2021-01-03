import { CircularDependencyException, UndefinedDependencyException } from './exceptions';
import { DEFAULT_INJECTION_CONTEXT, Scope } from './injection-context';
import { Module } from './module';
import { Reflector } from './reflection';
import {
  Class,
  InjectionContext,
  Provider,
  ProviderInstance,
  Token,
  isClass,
  isClassProvider,
  isFactoryProvider,
  isValueProvider,
} from './types';
import { run } from './utils';
import { runHooks } from './utils/hooks';

export class ProviderWrapper<T = unknown> {
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
    const inst = this._instances.get(DEFAULT_INJECTION_CONTEXT);

    if (inst == null) {
      // This should never happen as we always create the DEFAULT_INJECTION_CONTEXT
      throw new Error();
    }

    return inst;
  }

  public async getInstance(context: InjectionContext): Promise<T> {
    if (!this.isTransient) {
      return this.getSingleton();
    }

    const inst = this._instances.get(context);

    if (inst != null) {
      return inst;
    }

    return await this._createInstance(context);
  }

  private async _createInstance(context: InjectionContext): Promise<T> {
    if (this._instances.has(context)) {
      return this._instances.get(context)!;
    }

    const deps = await this._resolveDependencies(context);

    const inst: T = await run(async () => {
      // Do this again in case we created the instance when
      // resolving dependencies
      if (this._instances.has(context)) {
        return this._instances.get(context)!;
      }

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
      const depWrapper = this._resolveDependency(context, dep);

      let depValue: unknown;
      try {
        depValue = await depWrapper.getInstance(context);
      } catch (e) {
        await depWrapper._createInstance(context);
        depValue = await depWrapper.getInstance(context);
      }

      resolvedDependencies.push(depValue);
    }

    return resolvedDependencies;
  }

  private _resolveDependency(context: InjectionContext, dependency: Token): ProviderWrapper {
    if (dependency == null) {
      throw new CircularDependencyException(this.name);
    }

    return this._hostModule.resolveToken(dependency, context);
  }
}
