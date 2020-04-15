import { ModuleMetadata, RouteMetadata } from '../decorators';

export class Reflector {
  static getRouteMetadata(Route: Function): RouteMetadata {
    const view = Reflect.getMetadata<RouteMetadata, 'view'>('view', Route);
    const controller = Reflect.getMetadata<RouteMetadata, 'controller'>('controller', Route);

    if (view == null) {
      throw new Error(`Invalid Route ${Route.name}`);
    }

    return { view, controller };
  }

  static getModuleMetadata(Module: Function): ModuleMetadata {
    const routing = Reflect.getMetadata<ModuleMetadata, 'routing'>('routing', Module);
    const providers = Reflect.getMetadata<ModuleMetadata, 'providers'>('providers', Module);
    const imports = Reflect.getMetadata<ModuleMetadata, 'imports'>('imports', Module);
    const exports = Reflect.getMetadata<ModuleMetadata, 'exports'>('exports', Module);

    return { routing, providers, imports, exports };
  }
}
