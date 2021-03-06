import 'reflect-metadata';

import { NoProviderMetadataError } from '../errors';
import { Scope } from '../injection-context';
import { Class, ModuleMetadata, ProviderMetadata, Token } from '../types';

export class Reflector {
  static addModuleMetadata(target: Object, metadata: ModuleMetadata): void {
    const withDefaults = { providers: [], imports: [], exports: [], ...metadata };
    Reflect.defineMetadata('self:module', withDefaults, target);
  }

  static getModuleMetadata(metatype: Class): Required<ModuleMetadata> {
    return Reflect.getMetadata('self:module', metatype);
  }

  static addProviderMetadata(metatype: Object, metadata?: ProviderMetadata): void {
    const withDefaults = { scope: Scope.SINGLETON, ...(metadata ?? {}) };
    Reflect.defineMetadata('self:provider', withDefaults, metatype);
  }

  static getProviderMetadata(metatype: Class): Required<ProviderMetadata> {
    const metadata = Reflect.getMetadata('self:provider', metatype);

    if (metadata == null) {
      throw new NoProviderMetadataError(metatype.name);
    }

    return metadata;
  }

  static getConstructorDependencies(metatype?: Object): Array<Token> {
    if (metatype == null) {
      return [];
    }

    const dependencies = Reflect.getMetadata('design:paramtypes', metatype) ?? [];
    const manualDependencies = Reflector.getManuallyInjectedDeps(metatype);

    manualDependencies.forEach((dep) => (dependencies[dep.index] = dep.token));

    return dependencies;
  }

  static addManuallyInjectedDeps(
    target: Object,
    dependencies: Array<{ index: number; token: any }>,
  ): void {
    const existing = Reflector.getManuallyInjectedDeps(target);
    Reflect.defineMetadata('self:paramtypes', [...existing, ...dependencies], target);
  }

  static getManuallyInjectedDeps(target: Object): Array<{ index: number; token: any }> {
    return Reflect.getMetadata('self:paramtypes', target) ?? [];
  }
}
