import { ModuleDefinition, Provider } from '../types';
import { flatten } from '../utils';
import { Module } from './module';

async function _traverse(
  moduleDef: ModuleDefinition,
  visited = new Map<ModuleDefinition, Module>(),
): Promise<[Module, Array<Module>]> {
  const module = await Module.from(moduleDef);

  visited.set(moduleDef, module);

  const { imports = [] } = module.metadata;
  const children = [];
  const directChildren = [];

  for (const imported of imports) {
    if (!visited.has(imported)) {
      const [importedModule, childrenModules] = await _traverse(imported, visited);
      directChildren.push(importedModule);
      children.push(importedModule);
      children.push(...childrenModules);
    } else {
      directChildren.push(visited.get(imported)!);
    }
  }

  directChildren.forEach((importedModule) => module.imports.add(importedModule));

  return [module, children];
}

class GlobalModule {}

export class Container {
  public readonly globalModule = new Module(GlobalModule, {});

  private constructor(public readonly modules: Map<string, Module>) {
    modules.forEach((module) => (module.container = this));
  }

  static async from(moduleDef: ModuleDefinition): Promise<Container> {
    const modules = flatten<Module>(await _traverse(moduleDef));

    const modulesMap = modules.reduce(
      (memo, module) => memo.set(module.id, module),
      new Map<string, Module>(),
    );

    return new Container(modulesMap);
  }

  public async init(): Promise<void> {
    await this.globalModule.init();
    await this.globalModule.createInstances();

    for (const module of this.modules.values()) {
      await module.init();
    }

    for (const module of this.modules.values()) {
      await module.createInstances();
    }
  }

  public addGlobalProvider(provider: Provider): void {
    this.globalModule.addProvider(provider);
  }
}
