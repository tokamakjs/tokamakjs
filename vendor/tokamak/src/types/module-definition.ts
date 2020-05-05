import { ForwardReference } from '../core/forward-ref';
import { DynamicModule } from './dynamic-module';
import { Type } from './type';

export type ModuleDefinition = Type | DynamicModule | Promise<DynamicModule> | ForwardReference;

export function isForwardReference(module: any): module is ForwardReference {
  return module != null && (module as ForwardReference).forwardRef != null;
}

export function isDynamicModule(module: any): module is DynamicModule {
  return module != null && (module as DynamicModule).module != null;
}
