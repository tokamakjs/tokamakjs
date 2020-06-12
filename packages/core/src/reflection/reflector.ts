import { ControllerMetadata, ModuleMetadata } from '../decorators';
import { ProviderToken, Type } from '../types';

export class Reflector {
  static getModuleMetadata(metatype: Type): Required<ModuleMetadata> {
    const routing = Reflect.getMetadata<ModuleMetadata, 'routing'>('routing', metatype) ?? [];
    const providers = Reflect.getMetadata<ModuleMetadata, 'providers'>('providers', metatype) ?? [];
    const imports = Reflect.getMetadata<ModuleMetadata, 'imports'>('imports', metatype) ?? [];
    const exports = Reflect.getMetadata<ModuleMetadata, 'exports'>('exports', metatype) ?? [];

    return { routing, providers, imports, exports };
  }

  static getConstructorDependencies(metatype?: Object): Array<ProviderToken> {
    if (metatype == null) {
      return [];
    }

    const dependencies = Reflect.getMetadata('design:paramtypes', metatype) ?? [];
    const manualDependencies = Reflector.getManuallyInjectedDeps(metatype);

    manualDependencies.forEach((dep) => (dependencies[dep.index] = dep.token));

    return dependencies;
  }

  static getTypeOfProperty(target: Object, key: string | symbol): any {
    return Reflect.getMetadata('design:type', target, key);
  }

  static getManuallyInjectedDeps(target: Object): Array<{ index: number; token: any }> {
    return Reflect.getMetadata('self:paramtypes', target) ?? [];
  }

  static addManuallyInjectedDeps(
    target: Object,
    dependencies: Array<{ index: number; token: any }>,
  ): void {
    const existing = Reflector.getManuallyInjectedDeps(target);
    Reflect.defineMetadata('self:paramtypes', [...existing, ...dependencies], target);
  }

  static addControllerMetadata(target: Object, metadata: ControllerMetadata): void {
    Reflect.defineMetadata('self:controller', metadata, target);
  }

  static getControllerMetadata(target: Object): ControllerMetadata {
    return Reflect.getMetadata('self:controller', target);
  }

  static isController(target: Object): target is Type {
    return Reflect.getMetadata('self:controller', target) != null;
  }
}
