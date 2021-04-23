import { Reflector } from '../reflection';
import { ControllerMetadata, DecoratedController, DepsFn } from '../types';

export function Controller(metadata: ControllerMetadata = {}): ClassDecorator {
  return (Target: Function) => {
    Reflector.addControllerMetadata(Target, metadata);

    const proxy = new Proxy(Target, {
      construct(Target: any, args: Array<any>) {
        const inst = new Target(...args) as DecoratedController<unknown>;

        const stateKeys = Reflector.getStateKeys(inst) ?? [];
        const refKeys = Reflector.getRefKeys(inst) ?? [];
        const effectKeysMap = Reflector.getEffectKeysMap(inst) ?? new Map<PropertyKey, DepsFn>();

        inst.__controller__ = {
          stateKeys,
          refKeys,
          effectKeysMap,
        };

        return inst;
      },
    });

    Reflector.copyMetadata(Target, proxy);

    return proxy;
  };
}
