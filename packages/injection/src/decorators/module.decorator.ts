import { Reflector } from '../reflection';
import { ModuleMetadata } from '../types';

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function): void => {
    Reflector.addModuleMetadata(target, metadata);
  };
}
