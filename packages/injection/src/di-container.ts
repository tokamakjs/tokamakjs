import { Class } from 'type-fest';

import { InvalidScopeException, UnknownElementException } from './exceptions';
import { DEFAULT_INJECTION_CONTEXT } from './injection-context';
import { Module } from './module';
import { ProviderWrapper } from './provider-wrapper';
import { Reflector } from './reflection';
import { InjectionContext, ModuleDefinition, Provider, Token, isForwardReference } from './types';

const GLOBAL_MODULE_NAME = '__GLOBAL_MODULE__';

export class DiContainer {
  public static async from<T>(
    RootModule: Class<T>,
    kwargs?: {
      globalProviders: Array<Provider>;
    },
  ): Promise<DiContainer> {
    kwargs = { globalProviders: [], ...kwargs };
    const modulesMap: Map<ModuleDefinition, Module> = new Map();

    const transform = async (node: ModuleDefinition): Promise<Module> => {
      if (isForwardReference(node)) {
        return await transform(node.forwardRef());
      }

      if (modulesMap.has(node)) {
        return modulesMap.get(node)!;
      }

      const { name, ...metadata } = await Module.getMetadata(node);

      const module = new Module(name, metadata);
      modulesMap.set(node, module);

      const imports: Array<Module> = [];

      for (const imported of metadata.imports) {
        imports.push(await transform(imported));
      }

      module.imports = imports;

      return module;
    };

    await transform(RootModule);

    const globalModuleMeta = { exports: [], imports: [], providers: kwargs.globalProviders };
    const globalModule = new Module(GLOBAL_MODULE_NAME, globalModuleMeta);

    const modules = [globalModule, ...modulesMap.values()];
    const container = new DiContainer(modules);

    await container._createInstances();
    await container._callOnInit();
    await container._callOnDidInit();

    return container;
  }

  private constructor(private readonly _modules: Array<Module>) {
    this._modules.forEach((module) => (module.container = this));
  }

  get globalModule() {
    return this._modules.find((g) => g.name === GLOBAL_MODULE_NAME)!;
  }

  get providers() {
    return this._modules.reduce((memo, m) => new Map([...memo, ...m.providers]), new Map());
  }

  public get<T = unknown, R = T>(token: Token<T>): R {
    const provider = this.providers.get(token) as ProviderWrapper<R>;

    if (provider == null) {
      throw new UnknownElementException(token);
    }

    if (provider.isTransient) {
      throw new InvalidScopeException(token);
    }

    return provider.getInstance(DEFAULT_INJECTION_CONTEXT);
  }

  public async resolve<T = unknown, R = T>(
    token: Token<T>,
    context: InjectionContext = DEFAULT_INJECTION_CONTEXT,
    inquirer: any = { id: Math.random() },
  ): Promise<R> {
    const provider = this.providers.get(token) as ProviderWrapper<R>;

    if (provider == null) {
      throw new UnknownElementException(token);
    }

    return await provider.resolveInstance(context, inquirer);
  }

  public resolveDependencies<T>(Class: Class<T>): T {
    const deps = Reflector.getConstructorDependencies(Class);
    const resolvedDependencies = deps.map((token) => this.get(token));
    return new Class(...resolvedDependencies);
  }

  private async _createInstances(): Promise<void> {
    for (const module of this._modules) {
      await module.createInstances();
    }
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
