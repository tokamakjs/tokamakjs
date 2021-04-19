import { useEffect, useRef, useState } from 'react';

import { Reflector } from '../reflection';
import { ControllerMetadata, DecoratedController, DepsFn } from '../types';
import { HookService } from './hook-service.decorator';

function _createAccessProxy(
  target: Object,
  stateMap: Map<PropertyKey, ReturnType<typeof useState>>,
  refMap: Map<PropertyKey, ReturnType<typeof useRef>>,
): Object {
  return new Proxy(target, {
    get(target: any, p: PropertyKey) {
      if (stateMap.has(p)) {
        return stateMap.get(p)![0];
      }

      if (refMap.has(p)) {
        return refMap.get(p)!.current;
      }

      return target[p];
    },
    set(target: any, p: PropertyKey, value: any) {
      if (stateMap.has(p)) {
        const dispatch = stateMap.get(p)![1];
        dispatch(value);
        return true;
      }

      if (refMap.has(p)) {
        refMap.get(p)!.current = value;
        return true;
      }

      target[p] = value;
      return true;
    },
  });
}

function _createConstructProxy(Target: Function): Function {
  const proxy = new Proxy(Target, {
    construct(Target: any, args: Array<any>): DecoratedController {
      const instance = new Target(...args);

      // useState keys
      const stateKeys = Reflector.getStateKeys(instance) ?? [];
      const stateMap = new Map<PropertyKey, ReturnType<typeof useState>>();

      // useRef keys
      const refKeys = Reflector.getRefKeys(instance) ?? [];
      const refMap = new Map<PropertyKey, ReturnType<typeof useRef>>();

      // useEffect methods
      const effectKeys = Reflector.getEffectKeysMap(instance) ?? new Map<PropertyKey, DepsFn>();

      const proxiedInstance = _createAccessProxy(instance, stateMap, refMap) as DecoratedController;

      proxiedInstance.__controller__ = {
        callHooks: () => {
          stateKeys.forEach((key) => stateMap.set(key, useState(instance[key])));
          refKeys.forEach((key) => refMap.set(key, useRef(instance[key])));
          [...effectKeys.keys()].forEach((key) => {
            const hookBody = instance[key].bind(proxiedInstance);
            const deps = effectKeys.get(key)!(proxiedInstance);

            useEffect(() => {
              const unmountCb = hookBody();

              return () => {
                if (typeof unmountCb === 'function') {
                  return unmountCb();
                } else if (unmountCb instanceof Promise) {
                  return unmountCb.then((cb) => cb());
                }
              };
            }, deps);
          });
          HookService.callHooks(proxiedInstance);
        },
      };

      return proxiedInstance;
    },
  });

  Reflector.copyMetadata(Target, proxy);

  return proxy;
}

/**
 * A class decorated with @Controller() is just a @HookService() that also
 * allows the use of @state, @ref, @effect, etc... (basically, a deeper integration
 * with the view layer)
 */
export function Controller(metadata: ControllerMetadata = {}): ClassDecorator {
  return (Target: Function) => {
    Reflector.addControllerMetadata(Target, metadata);
    return _createConstructProxy(HookService()(Target) as Function) as any;
  };
}
