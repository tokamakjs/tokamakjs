export interface ModuleMetadata {
  routing?: Array<any>;
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
