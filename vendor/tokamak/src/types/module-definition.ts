import { ModuleMetadata } from '../decorators';
import { Type } from './type';

export interface DynamicModule<T = any> extends ModuleMetadata {
  module: Type<T>;
  global?: boolean;
}

export interface ForwardReference<T = any> {
  forwardRef: T;
}

export type ModuleDefinition<T = any> =
  | Type<T>
  | DynamicModule<T>
  | Promise<DynamicModule<T>>
  | ForwardReference<T>;

export function isForwardReference(module: any): module is ForwardReference {
  return module != null && (module as ForwardReference).forwardRef != null;
}

export function isDynamicModule(module: any): module is DynamicModule {
  return module != null && (module as DynamicModule).module != null;
}
