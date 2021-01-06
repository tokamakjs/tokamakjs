import { Scope } from './injection-context';

export type KeysOfType<T, KT> = { [K in keyof T]: T[K] extends KT ? K : never }[keyof T];

export type Class<T = unknown, Arguments extends any[] = any[]> = new (
  ...arguments_: Arguments
) => T;

export type Token<T = unknown> = string | symbol | Class<T>;

export interface ForwardReference<T = unknown> {
  forwardRef: () => T;
}

export function isForwardReference(module: any): module is ForwardReference {
  return module != null && (module as ForwardReference).forwardRef != null;
}

export interface ModuleMetadata {
  providers?: Array<Provider>;
  imports?: Array<ModuleDefinition>;
  exports?: Array<Token>;
}

export interface DynamicModule<T = unknown> extends ModuleMetadata {
  module: Class<T>;
}

export function isDynamicModule(module: any): module is DynamicModule {
  return module != null && (module as DynamicModule).module != null;
}

export type ModuleDefinition<T = unknown> =
  | Class<T>
  | DynamicModule<T>
  | Promise<DynamicModule<T>>
  | ForwardReference<ModuleDefinition>;

export interface InjectionContext {
  id: string;
}

export interface ClassProvider<T = unknown> {
  provide: Token;
  useClass: Class<T>;
  scope?: Scope;
}

export interface ValueProvider<T = unknown> {
  provide: Token;
  useValue: T;
  scope?: Scope.SINGLETON;
}

export interface FactoryProvider<T = unknown> {
  provide: Token;
  useFactory: (...args: any[]) => T | Promise<T>;
  inject?: Array<Token>;
  scope?: Scope;
}

export type Provider<T = unknown> =
  | Class<T>
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>;

export function isClass(fn: any): fn is Class {
  try {
    new fn();
  } catch (err) {
    if (err.message.indexOf('is not a constructor') >= 0) {
      return false;
    }
  }

  return true;
}

export function isClassProvider(p: any): p is ClassProvider {
  return p?.useClass != null;
}

export function isValueProvider(p: any): p is ValueProvider {
  return p?.useValue != null;
}

export function isFactoryProvider(p: any): p is FactoryProvider {
  return p?.useFactory != null;
}

export interface ProviderMetadata {
  scope?: Scope;
}
