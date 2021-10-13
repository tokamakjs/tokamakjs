import { ProviderMetadata, Injectable as _Injectable } from '@tokamakjs/injection';

import { HookService } from './hook-service.decorator';

const previousPrototypes = new Map()

export function Injectable(metadata?: ProviderMetadata): ClassDecorator {
  return (Target: Function): void => {
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
    
    _Injectable(metadata)(Target);

    const deps = _Injectable.getDependencies(Target);

    if (deps.some((dep) => HookService.isHookService(dep)) && !HookService.isHookService(Target)) {
      throw new Error('No HookService as dependencies');
    }
  };
}
