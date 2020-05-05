import { ModuleDefinition } from '../types';
import { flatten } from './flatten';
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

export class Container {
  private constructor(public readonly modules: Map<string, Module>) {
    modules.forEach((module) => (module.container = this));
  }

  static async scan(moduleDef: ModuleDefinition): Promise<Container> {
    const modules = flatten<Module>(await _traverse(moduleDef));

    const modulesMap = modules.reduce(
      (memo, module) => memo.set(module.id, module),
      new Map<string, Module>(),
    );

    for (const module of modules) {
      await module.init();
    }

    for (const module of modules) {
      await module.createInstances();
    }

    return new Container(modulesMap);
  }
}
