import { CircularDependencyException, UnknownModuleException } from '../exceptions';
import { Reflector } from '../reflection';
import { Node, Type } from '../types';
import { ModuleTokenFactory } from './ModuleTokenFactory';
import { ModuleWrapper } from './ModuleWrapper';

export class Container {
  private readonly _tokenFactory = new ModuleTokenFactory();
  public readonly modules = new Map<string, ModuleWrapper>();
  private _initialized = false;

  public async initialize() {
    await this.addDependencies();
    await this.instantiateDependencies();
    this._initialized = true;
  }

  get isInitialized() {
    return this._initialized;
  }

  public async addNodes(nodes: Array<Node>): Promise<Array<ModuleWrapper>> {
    const modules = await Promise.all(
      nodes.map(async (node) => {
        return await this.addNode(node);
      }),
    );

    this._initialized = false;

    return modules;
  }

  public async addNode(node: Node): Promise<ModuleWrapper> {
    const token = this._tokenFactory.getToken(node.metatype);

    if (this.modules.has(token)) {
      return this.modules.get(token)!;
    }

    const module = new ModuleWrapper(node.metatype, node.scope);
    this.modules.set(token, module);

    this._initialized = false;

    return module;
  }

  private async addDependencies(): Promise<void> {
    for (const [, module] of this.modules) {
      this.addImports(module);
      this.addProviders(module);
      this.addControllers(module);
      this.addExports(module);
    }
  }

  private addImports(module: ModuleWrapper): void {
    const { imports } = Reflector.getModuleMetadata(module.metatype);

    imports.forEach((imported) => {
      if (imported === undefined) {
        throw new CircularDependencyException(module.metatype.name);
      }

      const relatedToken = this._tokenFactory.getToken(imported);
      const importedModule = this.modules.get(relatedToken);

      if (importedModule == null) {
        throw new UnknownModuleException(module.metatype.name);
      }

      module.addRelatedModule(importedModule);
    });
  }

  private addExports(module: ModuleWrapper): void {
    const { exports } = Reflector.getModuleMetadata(module.metatype);

    exports.forEach((provider) => {
      module.addExportedProviderOrModule(provider);
    });
  }

  private addProviders(module: ModuleWrapper): void {
    const { providers } = Reflector.getModuleMetadata(module.metatype);

    providers.forEach((provider) => {
      if (provider === undefined) {
        throw new CircularDependencyException();
      }

      module.addProvider(provider);
    });
  }

  private addControllers(module: ModuleWrapper): void {
    const { routing } = Reflector.getModuleMetadata(module.metatype);

    const addControllersFromRoute = (Route: Type) => {
      const { controller } = Reflector.getRouteMetadata(Route);

      if (controller == null) {
        return;
      }

      module.addProvider(controller);
    };

    routing.forEach((route) => {
      const { Route } = route;
      addControllersFromRoute(Route);
      route.children.forEach((route) => addControllersFromRoute(route.Route));
    });
  }

  private async instantiateDependencies(): Promise<void> {
    this.modules.forEach((module) => {
      module.createInstances();
    });
  }
}
