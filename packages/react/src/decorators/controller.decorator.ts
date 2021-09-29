import { Reflector } from '../reflection';
import { ControllerMetadata } from '../types';

const previousPrototypes = new Map()

export function Controller(metadata: ControllerMetadata): ClassDecorator {
  return (Target: Function) => {
    if(module.hot) {
      const previousPrototype = previousPrototypes.get(Target.name)

      if(previousPrototype) {
        Object.getOwnPropertyNames(Target.prototype).forEach((k) => {
          const value = Target.prototype[k]

          previousPrototype[k] = value;
        })
      }

      previousPrototypes.set(Target.name, Target.prototype)
    }

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
