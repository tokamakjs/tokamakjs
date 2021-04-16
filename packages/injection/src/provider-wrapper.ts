import { CircularDependencyException } from './exceptions';
import { DEFAULT_INJECTION_CONTEXT, Scope } from './injection-context';
import { Module } from './module';
import { Reflector } from './reflection';
import {
  Class,
  InjectionContext,
  Provider,
  Token,
  isClassProvider,
  isFactoryProvider,
  isValueProvider,
} from './types';
import { run } from './utils';
import { runHooks } from './utils/hooks';

type Inquirer = ProviderWrapper<unknown> | { id: number };

export class ProviderWrapper<T = unknown> {
  private readonly _provider: Exclude<Provider<T>, Class<T>>;
  private readonly _instances: Map<InjectionContext, Map<Inquirer, T>> = new Map();

  constructor(private readonly _hostModule: Module, provider: Provider<T>) {
    if (typeof provider === 'function') {
      const { scope } = Reflector.getProviderMetadata(provider);
      this._provider = { useClass: provider, scope, provide: provider };
    } else {
      this._provider = { scope: Scope.SINGLETON, ...provider };
    }
  }

  get isTransient() {
    return this._provider.scope === Scope.TRANSIENT;
  }

  get isSingleton() {
    return this._provider.scope !== Scope.TRANSIENT;
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
    if (this.isSingleton) {
      const inst = this._getSingleton(DEFAULT_INJECTION_CONTEXT);
      await runHooks(inst, 'onModuleInit');
    } else {
      const visited: Array<unknown> = [this._getSingleton(DEFAULT_INJECTION_CONTEXT)];
      for (const inst of this._instances.get(DEFAULT_INJECTION_CONTEXT)?.values() ?? []) {
        if (!visited.includes(inst)) {
          await runHooks(inst, 'onModuleInit');
          visited.push(inst);
        }
      }
    }
  }

  public async callOnDidInit(): Promise<void> {
    if (this.isSingleton) {
      const inst = this._getSingleton(DEFAULT_INJECTION_CONTEXT);
      await runHooks(inst, 'onModuleDidInit');
    } else {
      const visited: Array<unknown> = [this._getSingleton(DEFAULT_INJECTION_CONTEXT)];
      for (const inst of this._instances.get(DEFAULT_INJECTION_CONTEXT)?.values() ?? []) {
        if (!visited.includes(inst)) {
          await runHooks(inst, 'onModuleDidInit');
          visited.push(inst);
        }
      }
    }
  }

  public async createInstance(): Promise<T> {
    return await this.resolveInstance(DEFAULT_INJECTION_CONTEXT);
  }

  public async resolveInstance(context: InjectionContext, inquirer: Inquirer = this): Promise<T> {
    if (this._hasInstance(context, inquirer)) {
      return this.getInstance(context, inquirer);
    }

    return await this._createInstance(context, inquirer);
  }

  public getInstance(context: InjectionContext, inquirer: Inquirer = this): T {
    const inst = this.isSingleton
      ? this._getSingleton(context)
      : this._instances.get(context)?.get(inquirer);

    if (inst == null) {
      throw new Error('No instance found.');
    }

    return inst;
  }

  private _hasInstance(context: InjectionContext, inquirer: Inquirer): boolean {
    if (this.isSingleton) {
      return this._instances.get(context)?.get(this) != null;
    }

    return this._instances.get(context)?.get(inquirer) != null;
  }

  private _getSingleton(context: InjectionContext): T {
    const inst = this._instances.get(context)?.get(this);

    if (inst == null) {
      throw new Error('No instance found.');
    }

    return inst;
  }

  private _setSingleton(context: InjectionContext, singleton: T): void {
    let inquirerInstances = this._instances.get(context);

    if (inquirerInstances == null) {
      inquirerInstances = new Map();
    }

    inquirerInstances.set(this, singleton);
    this._instances.set(context, inquirerInstances);
  }

  private async _createInstance(context: InjectionContext, inquirer: Inquirer): Promise<T> {
    if (this._hasInstance(context, inquirer)) {
      return this.getInstance(context, inquirer);
    }

    const deps = await this._resolveDependencies(context, inquirer);

    const inst: T = await run(async () => {
      // Do this again in case we created the instance when
      // resolving dependencies
      if (this._hasInstance(context, inquirer)) {
        return this.getInstance(context, inquirer);
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
      this._setSingleton(context, inst);
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
      if (depWrapper._hasInstance(context, inquirer)) {
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
