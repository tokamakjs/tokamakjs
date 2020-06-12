import { Type } from '../utils';
import { Scope } from './enums';

export type ProviderToken = string | symbol | Type<any> | Function;

export interface ClassProvider<T = any> {
  provide: ProviderToken;
  useClass: Type<T>;
  scope?: Scope;
}

export interface ValueProvider<T = any> {
  provide: ProviderToken;
  useValue: T;
}

export interface FactoryProvider<T = any> {
  provide: ProviderToken;
  useFactory: (...args: any[]) => T;
  inject?: Array<Type<any> | string | symbol | Function>;
  scope?: Scope;
}

export type Provider<T = any> = Type<T> | ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>;

export type CustomProvider<T = any> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>;

export function isCustomProvider(provider: Provider): provider is CustomProvider {
  return provider != null && typeof provider !== 'function';
}

export function isClassProvider(provider: Provider): provider is ClassProvider {
  return provider != null && (provider as ClassProvider).useClass != null;
}

export function isValueProvider(provider: Provider): provider is ValueProvider {
  return provider != null && (provider as ValueProvider).useValue != null;
}

export function isFactoryProvider(provider: Provider): provider is FactoryProvider {
  return provider != null && (provider as FactoryProvider).useFactory != null;
}
