import { Injectable, Scope } from '@tokamakjs/injection';

import { Reflector } from '../reflection';
import { DecoratedHookService, isDecoratedHookService } from '../types';

function _createAccessProxy(
  target: Object,
  hooksMap: Map<PropertyKey, { __hookCb__: Function }>,
): Object {
  return new Proxy(target, {
    get(target: any, p: PropertyKey) {
      if (hooksMap.has(p)) {
        return hooksMap.get(p)!;
      }

      return Reflect.get(target, p);
    },
    set(target: any, p: PropertyKey, value: any) {
      if (hooksMap.has(p)) {
        return false;
      }

      return Reflect.set(target, p, value);
    },
  });
}

function _createConstructProxy(Target: Function): Function {
  const proxy = new Proxy(Target, {
    construct(Target: any, args: Array<any>): DecoratedHookService {
      const instance = new Target(...args);

      // Collect hook calls
      const hooksKeys = Object.entries(instance)
        .filter((e: [string, any]) => e[1].__hookCb__ != null)
        .map((e: [string, any]) => e[0]);
      const hooksMap = new Map<PropertyKey, { __hookCb__: Function }>();

      // Collect hook dependencies (HookServices)
      const hookDeps: Array<DecoratedHookService> = args.filter((a) => isDecoratedHookService(a));

      const proxiedInstance = _createAccessProxy(instance, hooksMap) as DecoratedHookService;

      proxiedInstance.__hookService__ = {
        callHooks: () => {
          hooksKeys.forEach((key) => hooksMap.set(key, instance[key].__hookCb__()));
          hookDeps.forEach((dep) => HookService.callHooks(dep));
        },
      };

      return proxiedInstance;
    },
  });

  Reflector.copyMetadata(Target, proxy);

  return proxy;
}

export function HookService(): ClassDecorator {
  return (Target: Function) => {
    Injectable({ scope: Scope.TRANSIENT })(Target);
    return _createConstructProxy(Target) as any;
  };
}

HookService.callHooks = <T>(target: T): void => {
  if (isDecoratedHookService(target)) {
    target.__hookService__.callHooks();
  }
};
