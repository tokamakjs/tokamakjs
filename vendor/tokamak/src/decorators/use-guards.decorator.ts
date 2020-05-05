import { CanActivate } from '../interfaces';
import { Reflector } from '../reflection';
import { Type } from '../types';

export function useGuards(...guards: Array<CanActivate | Type<CanActivate>>): ClassDecorator {
  return (target: any) => {
    Reflector.addGuards(target, guards);
  };
}
