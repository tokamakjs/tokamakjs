import { useEffect, useRef, useState } from 'react';

import { Reflector } from '../reflection';
import { ControllerMetadata, DecoratedController } from '../types';

function _createAccessProxy(
  target: Object,
  stateMap: Map<PropertyKey, ReturnType<typeof useState>>,
  refMap: Map<PropertyKey, ReturnType<typeof useRef>>,
  hooksMap: Map<PropertyKey, { __hookCb__: Function }>,
): Object {
  return new Proxy(target, {
    get(target: any, p: PropertyKey) {
      if (stateMap.has(p)) {
        return stateMap.get(p)![0];
      }

      if (refMap.has(p)) {
        return refMap.get(p)!.current;
      }

      if (hooksMap.has(p)) {
        return hooksMap.get(p)!;
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

      if (hooksMap.has(p)) {
        return false;
      }

      target[p] = value;
      return true;
    },
  });
}

function _createConstructProxy(Target: Function): Function {
  const proxy = new Proxy(Target, {
    construct(Target: any, args): DecoratedController {
      const instance = new Target(...args);

      // Create useState keys
      const stateKeys = Reflector.getStateKeys(instance) ?? [];
      const stateMap = new Map<PropertyKey, ReturnType<typeof useState>>();

      // Create useRef keys
      const refKeys = Reflector.getRefKeys(instance) ?? [];
      const refMap = new Map<PropertyKey, ReturnType<typeof useRef>>();

      // Create useEffect methods
      const effectKeys = Reflector.getEffectKeysMap(instance);

      // Collect hook calls
      const hooksKeys = Object.entries(instance)
        .filter((e: [string, any]) => e[1].__hookCb__ != null)
        .map((e: [string, any]) => e[0]);
      const hooksMap = new Map<PropertyKey, { __hookCb__: Function }>();

      const proxiedInstance = _createAccessProxy(
        instance,
        stateMap,
        refMap,
        hooksMap,
      ) as DecoratedController;

      proxiedInstance.__controller__ = {
        callHooks: () => {
          for (const key of effectKeys?.keys() ?? []) {
            stateKeys.forEach((key) => stateMap.set(key, useState(instance[key])));
            refKeys.forEach((key) => refMap.set(key, useRef(instance[key])));
            useEffect(instance[key].bind(proxiedInstance), effectKeys!.get(key)!(proxiedInstance));
            hooksKeys.forEach((key) => hooksMap.set(key, instance[key].__hookCb__()));
          }
        },
      };

      proxiedInstance.__controller__.callHooks();

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
