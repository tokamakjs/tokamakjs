import { useEffect, useRef, useState } from 'react';

import { Reflector } from '../reflection';
import { ControllerMetadata } from '../types';

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
    construct(Target: any, args) {
      const instance = new Target(...args);

      // Create useState keys
      const stateKeys = Reflector.getStateKeys(instance) ?? [];
      const stateMap = new Map<PropertyKey, ReturnType<typeof useState>>();
      stateKeys.forEach((key) => stateMap.set(key, useState(instance[key])));

      // Create useRef keys
      const refKeys = Reflector.getRefKeys(instance) ?? [];
      const refMap = new Map<PropertyKey, ReturnType<typeof useRef>>();
      refKeys.forEach((key) => refMap.set(key, useRef(instance[key])));

      const proxiedInstance = _createAccessProxy(instance, stateMap, refMap);

      // Create useEffect methods
      const effectKeys = Reflector.getEffectKeysMap(instance);

      for (const key of effectKeys?.keys() ?? []) {
        useEffect(instance[key].bind(proxiedInstance), effectKeys!.get(key)!(proxiedInstance));
      }

      return proxiedInstance;
    },
  });

  Reflector.copyMetadata(Target, proxy);

  return proxy;
}

export function Controller(metadata: ControllerMetadata = {}): ClassDecorator {
  return (target: Function) => {
    Reflector.addControllerMetadata(target, metadata);
    return _createConstructProxy(target) as any;
  };
}
