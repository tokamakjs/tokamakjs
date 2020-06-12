import { ModuleDefinition } from '../injection';
import { Reflector } from '../reflection';
import { RouteDefinition } from '../routing';

export interface ModuleMetadata {
  routing?: Array<RouteDefinition>;
  providers?: Array<any>;
  imports?: Array<ModuleDefinition>;
  exports?: Array<any>;
}

export function module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function): void => {
    Reflector.addModuleMetadata(target, metadata);
  };
}
