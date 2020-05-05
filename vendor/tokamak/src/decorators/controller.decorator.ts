import { CanActivate } from '../interfaces';
import { Reflector } from '../reflection';
import { Type, View } from '../types';

export interface ControllerMetadata {
  view: View;
  guards?: Array<CanActivate | Type<CanActivate>>;
}

export function controller(metadata: ControllerMetadata): ClassDecorator {
  return (target: Function) => {
    Reflector.addControllerMetadata(target, metadata);
  };
}
