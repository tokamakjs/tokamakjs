import { CircularDependencyException, InvalidScopeException } from './exceptions';
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

type Inquirer = ProviderWrapper<unknown>;

export class ProviderWrapper<T = unknown> {
  private readonly _provider: Exclude<Provider<T>, Class<T>>;
  private readonly _instances: Map<InjectionContext, Map<Inquirer, T>> = new Map();
  private readonly _singletons: Map<InjectionContext, T> = new Map();

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

  get isSingleton() {
    return this._provider.scope === Scope.SINGLETON;
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
    const inst = this._singletons.get(DEFAULT_INJECTION_CONTEXT);
    // TODO: Do the same for DEFAULT_INJECTION_CONTEXT transients
    runHooks(inst, 'onModuleInit');
  }

  public async callOnDidInit(): Promise<void> {
    const inst = this._singletons.get(DEFAULT_INJECTION_CONTEXT);
    // TODO: Do the same for DEFAULT_INJECTION_CONTEXT transients
    runHooks(inst, 'onModuleDidInit');
  }

  public async createInstance(): Promise<T> {
    return await this.resolveInstance(DEFAULT_INJECTION_CONTEXT);
  }

  public async resolveInstance(context: InjectionContext, inquirer?: Inquirer): Promise<T> {
    inquirer = inquirer == null ? this : inquirer;
    if (this.hasInstance(context, inquirer)) {
      return this.getInstance(context, inquirer);
    }

    return await this._createInstance(context, inquirer);
  }

  public getInstance(context: InjectionContext, inquirer?: Inquirer): T {
    inquirer = inquirer == null ? this : inquirer;
    const inst = this._instances.get(context)?.get(inquirer);

    if (inst == null) {
      throw new Error('No instance found.');
    }

    return inst;
  }

  public hasInstance(context: InjectionContext, inquirer: Inquirer): boolean {
    return this._instances.get(context)?.get(inquirer) != null;
  }

  private async _createInstance(context: InjectionContext, inquirer: Inquirer): Promise<T> {
    if (this.hasInstance(context, inquirer)) {
      return this.getInstance(context, inquirer);
    }

    const deps = await this._resolveDependencies(context, inquirer);

    const inst: T = await run(async () => {
      // Do this again in case we created the instance when
      // resolving dependencies
      if (this.hasInstance(context, inquirer)) {
        return this.getInstance(context, inquirer);
      }

      if (this.isSingleton && this._singletons.has(context)) {
        return this._singletons.get(context)!;
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

    if (this.isSingleton) {
      this._singletons.set(context, inst);
    }

    let inquirerInstances = this._instances.get(context);

    if (inquirerInstances == null) {
      inquirerInstances = new Map();
    }

    inquirerInstances.set(inquirer, inst);
    this._instances.set(context, inquirerInstances);
    return inst;
  }

  private async _resolveDependencies(
    context: InjectionContext,
    inquirer: Inquirer,
  ): Promise<Array<unknown>> {
    // TODO: Add support for optional dependencies marked with @optional
    const optionalDependencies = [] as Array<Token>;

    const resolvedDependencies = [] as Array<unknown>;

    for (const dep of [...this.dependencies, ...optionalDependencies]) {
      const depWrapper = this._resolveDependency(dep, context);

      let depValue: unknown;
      if (depWrapper.hasInstance(context, inquirer)) {
        depValue = depWrapper.getInstance(context, inquirer);
      } else {
        depValue = await depWrapper.resolveInstance(context, inquirer);
      }

      resolvedDependencies.push(depValue);
    }

    return resolvedDependencies;
  }

  private _resolveDependency(dependency: Token, context: InjectionContext): ProviderWrapper {
    if (dependency == null) {
      throw new CircularDependencyException(this.name);
    }

    return this._hostModule.resolveToken(dependency, context);
  }
}
