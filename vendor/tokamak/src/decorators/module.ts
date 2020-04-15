import { RouteDefinition } from '../core';

export enum ModuleMetadataKey {
  ROUTING = 'routing',
  PROVIDERS = 'providers',
  IMPORTS = 'imports',
  EXPORTS = 'exports',
}

export interface ModuleMetadata {
  routing?: Array<RouteDefinition>;
  providers?: Array<any>;
  imports?: Array<any>;
  exports?: Array<any>;
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function): void => {
    Reflect.ownKeys(metadata).forEach((key) => {
      Reflect.defineMetadata(key, metadata[key as keyof ModuleMetadata], target);
    });
  };
}
