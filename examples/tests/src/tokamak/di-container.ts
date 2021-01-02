import { Class } from 'type-fest';

import { Module } from './module';
import { ProviderWrapper } from './provider-wrapper';
import { InjectionContext, ModuleDefinition, Token } from './types';
import { flattenTree } from './utils';

export class DiContainer {
  private _providers: Map<Token, ProviderWrapper<any>> = new Map();
  private _globalModule: Module;

  public static async from<T>(RootModule: Class<T>): Promise<DiContainer> {
    const transform = async (node: ModuleDefinition): Promise<Module> => {
      const metadata = await Module.getMetadata(node);
      const imports = await Promise.all(metadata.imports.map(transform));
      return new Module(metadata, imports);
    };

    const moduleTree = await transform(RootModule);
    const modules = flattenTree(moduleTree, 'imports');

    for (const module of modules) {
      await module.createInstances();
    }

    return new DiContainer(modules);
  }

  private constructor(private readonly _modules: Array<Module>) {
    this._globalModule = null as any; // TODO:
    this._modules.forEach((module) => (module.container = this));
  }

  get globalModule() {
    return this._globalModule;
  }

  get providers() {
    return this._modules.reduce((memo, m) => new Map([...memo, ...m.providers]), new Map());
  }

  public get<T = unknown, R = T>(token: Token<T>): R {
    console.log(this.providers);
    const provider = this.providers.get(token) as ProviderWrapper<R>;

    if (provider == null) {
      throw new Error('Provider null');
    }

    if (provider.isTransient) {
      throw new Error('Invalid scope');
    }

    return provider.getSingleton();
  }

  public async resolve<T = unknown, R = T>(token: Token<T>, context: InjectionContext): Promise<R> {
    const provider = this.providers.get(token) as ProviderWrapper<R>;

    if (provider == null) {
      throw new Error('Provider null');
    }

    return await provider.getInstance(context);
  }
}
