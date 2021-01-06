import { Reflector } from '../reflection';
import { ControllerMetadata } from '../types';

export function Controller(metadata: ControllerMetadata): ClassDecorator {
  return (target: Function): void => {
    Reflector.addControllerMetadata(target, metadata);
  };
}
