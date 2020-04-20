import { ModuleMetadata, RouteMetadata } from '../decorators';
import { Type } from '../types';

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

  static getConstructorParameters(metatype: Type): Array<Type> {
    return Reflect.getMetadata('design:paramtypes', metatype);
  }
}
