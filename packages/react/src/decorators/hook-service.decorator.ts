import { Injectable, Scope } from '@tokamakjs/injection';

import { Reflector } from '../reflection';

export function HookService(): ClassDecorator {
  return (Target: Function) => {
    Reflector.addHookServiceMetadata(Target);
    Injectable({ scope: Scope.TRANSIENT })(Target);
  };
}

HookService.isHookService = (Target: any): boolean => {
  return Reflector.getHookServiceMetadata(Target) != null;
};
