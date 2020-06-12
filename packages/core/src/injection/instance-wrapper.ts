import { Type } from '../utils';
import { Context, DEFAULT_CONTEXT } from './constants';
import { Scope } from './enums';
import { InstanceCreator } from './instance-creator';
import { Module } from './module';
import { ProviderToken } from './provider';

interface InstanceWrapperKwargs<T> {
  isResolved: boolean;
  metatype?: Type<T>;
  instance?: T;
  scope?: Scope;
  isAsync?: boolean;
  inject?: Array<ProviderToken>;
}

export interface Instance<T> {
  value?: T;
  isResolved: boolean;
  isPending?: boolean;
  promise?: Promise<void>;
}

export class InstanceWrapper<T = any> {
  public readonly scope: Scope;
  public readonly isAsync: boolean;
  public readonly metatype?: Type<T> | Function;
  public inject?: Array<ProviderToken>;
  private readonly instances = new WeakMap<Context, Instance<T>>();
  private readonly creator: InstanceCreator<T>;

  constructor(
    public readonly name: string,
    public readonly host: Module,
    kwargs: InstanceWrapperKwargs<T>,
  ) {
    this.metatype = kwargs.metatype;
    this.scope = kwargs.scope ?? Scope.SINGLETON;
    this.isAsync = kwargs.isAsync ?? false;
    this.inject = kwargs.inject;

    this.setInstance({ value: kwargs.instance, isResolved: kwargs.isResolved });

    this.creator = new InstanceCreator(this);
  }

  get defaultValue(): T | undefined {
    // Gets the value of the default context instance
    const { value } = this.getInstance();
    return value;
  }

  public setInstance(instance: Instance<T>, context: Context = DEFAULT_CONTEXT): void {
    this.instances.set(context, instance);
  }

  public getInstance(context: Context = DEFAULT_CONTEXT): Instance<T> {
    const instance = this.instances.get(context);

    if (instance == null) {
      // This shouldn't happen with the DEFAULT_CONTEXT
      throw new Error(`No instance with context ${context.id} found.`);
    }

    return instance;
  }

  public async createInstance(context: Context = DEFAULT_CONTEXT): Promise<Instance<T>> {
    const instance = await this.creator.create(context);
    this.instances.set(context, instance);
    return instance;
  }
}
