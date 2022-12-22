import { Class } from '@tokamakjs/injection';

import { Reflector } from '../reflection';
import { ControllerMetadata, DecoratedController } from '../types';

export function Controller<T = any>(metadata: ControllerMetadata) {
  return (Target: Class<T>): Class<DecoratedController<T>> => {
    Reflector.addControllerMetadata(Target, metadata);

    const ProxyTarget = new Proxy(Target, {
      construct(Target: any, args: Array<any>) {
        return Reflector.createDecoratedController(Target, ...args);
      },
    }) as Class<DecoratedController<T>>;

    Reflector.copyMetadata(Target, ProxyTarget);

    return ProxyTarget;
  };
}
