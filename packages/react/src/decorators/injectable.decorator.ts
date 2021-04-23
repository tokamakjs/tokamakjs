import { ProviderMetadata, Injectable as _Injectable } from '@tokamakjs/injection';

import { HookService } from './hook-service.decorator';

export function Injectable(metadata?: ProviderMetadata): ClassDecorator {
  return (Target: Function): void => {
    _Injectable(metadata)(Target);

    const deps = _Injectable.getDependencies(Target);

    if (deps.some((dep) => HookService.isHookService(dep)) && !HookService.isHookService(Target)) {
      throw new Error('No HookService as dependencies');
    }
  };
}
