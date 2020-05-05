import { ModuleMetadata, RouteMetadata } from '../decorators';
import { ProviderToken, Type } from '../types';

export class Reflector {
  static getRouteMetadata(metatype: Type): RouteMetadata {
    const view = Reflect.getMetadata<RouteMetadata, 'view'>('view', metatype);
    const controller = Reflect.getMetadata<RouteMetadata, 'controller'>('controller', metatype);

    if (view == null) {
      throw new Error(`Invalid Route ${metatype.name}`);
    }

    return { view, controller };
  }

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
}
