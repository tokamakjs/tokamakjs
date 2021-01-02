import { CanActivate } from '../interfaces';
import { Reflector } from '../reflection';
import { Constructor } from '../utils';

export type View = (ctrl?: any) => JSX.Element | null | string;

export interface ControllerMetadata {
  view: View;
  states?: {
    error?: View;
    loading?: View;
  };
  guards?: Array<Constructor<CanActivate>>;
}

export function Controller(metadata: ControllerMetadata): ClassDecorator {
  return (target: Function) => {
    Reflector.addControllerMetadata(target, metadata);
  };
}
