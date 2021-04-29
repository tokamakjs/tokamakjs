import { Reflector } from '../reflection';
import { ControllerMetadata } from '../types';

export function Controller(metadata: ControllerMetadata = {}): ClassDecorator {
  return (Target: Function) => {
    Reflector.addControllerMetadata(Target, metadata);

    const proxy = new Proxy(Target, {
      construct(Target: any, args: Array<any>) {
        return Reflector.createDecoratedController(Target, ...args);
      },
    });

    Reflector.copyMetadata(Target, proxy);

    return proxy;
  };
}
