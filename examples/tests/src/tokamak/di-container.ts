import { Class } from 'type-fest';

import { Module } from './module';
import { ProviderWrapper } from './provider-wrapper';
import { InjectionContext, ModuleDefinition, Token } from './types';
import { flattenTree } from './utils';

export class DiContainer {
  private _globalModule: Module;

  public static async from<T>(RootModule: Class<T>): Promise<DiContainer> {
    const transform = async (node: ModuleDefinition): Promise<Module> => {
      const { name, ...metadata } = await Module.getMetadata(node);
      const imports = await Promise.all(metadata.imports.map(transform));
      return new Module(name, metadata, imports);
    };

    const moduleTree = await transform(RootModule);
    const modules = flattenTree(moduleTree, 'imports');

    for (const module of modules) {
      await module.createInstances();
    }

    const container = new DiContainer(modules);

    container._callOnInit();
    container._callOnDidInit();

    return container;
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

  private async _callOnInit(): Promise<void> {
    for (const module of this._modules) {
      await module.callOnInit();
    }
  }

  private async _callOnDidInit(): Promise<void> {
    for (const module of this._modules) {
      await module.callOnDidInit();
    }
  }
}
