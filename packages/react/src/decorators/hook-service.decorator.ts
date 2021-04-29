import { Injectable, Scope } from '@tokamakjs/injection';

import { useHooksContainer } from '../hooks';
import { Reflector } from '../reflection';

export function HookService(): ClassDecorator {
  return (Target: Function) => {
    Reflector.addHookServiceMetadata(Target);
    Injectable({ scope: Scope.TRANSIENT })(Target);

    const proxy = new Proxy(Target, {
      construct(Target: any, args: Array<any>) {
        const inst = Reflector.createHooksContainer(Target, ...args);

        // Hooks are used as soon as the class is instantiated as opposed to
        // controllers where hooks are used in useController()
        return useHooksContainer(inst);
      },
    });

    Reflector.copyMetadata(Target, proxy);

    return proxy;
  };
}

HookService.isHookService = (Target: any): boolean => {
  return Reflector.getHookServiceMetadata(Target) != null;
};
