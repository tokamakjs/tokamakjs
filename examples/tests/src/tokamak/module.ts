import { DiContainer } from './di-container';
import { CircularDependencyException, UndefinedDependencyException } from './exceptions';
import { DEFAULT_INJECTION_CONTEXT } from './injection-context';
import { ModuleRef } from './module-ref';
import { ProviderWrapper } from './provider-wrapper';
import { Reflector } from './reflection';
import {
  InjectionContext,
  ModuleDefinition,
  ModuleMetadata,
  Token,
  isDynamicModule,
  isForwardReference,
} from './types';

export class Module {
  private readonly _providers: Map<Token, ProviderWrapper<unknown>> = new Map();

  private _container?: DiContainer;

  constructor(
    private readonly _name: string,
    private readonly _metadata: Required<ModuleMetadata>,
    private readonly _imports: Array<Module>,
  ) {
    const { providers } = this._metadata;
    const useModuleRefProvider = { provide: ModuleRef, useValue: new ModuleRef(this) };

    for (const provider of [...providers, useModuleRefProvider]) {
      const wrapper = new ProviderWrapper(this, provider);
      this._providers.set(wrapper.key, wrapper);
    }
  }

  public static async getMetadata<T>(
    moduleDef: ModuleDefinition<T>,
  ): Promise<Required<ModuleMetadata> & { name: string }> {
    moduleDef = await moduleDef;

    if (isForwardReference(moduleDef)) {
      const forwardedModule = moduleDef.forwardRef();
      return Module.getMetadata(forwardedModule);
    } else if (isDynamicModule(moduleDef)) {
      const { module, ...metadata } = { providers: [], imports: [], exports: [], ...moduleDef };
      return { ...metadata, name: module.name };
    } else {
      const metadata = Reflector.getModuleMetadata(moduleDef);
      return { ...metadata, name: moduleDef.name };
    }
  }

  get providers() {
    return this._providers;
  }

  get container() {
    return this._container;
  }

  set container(container: DiContainer | undefined) {
    this._container = container;
  }

  get imports() {
    return this._imports;
  }

  get exports() {
    return this._metadata.exports;
  }

  get name() {
    return this._name;
  }

  public async createInstances(): Promise<void> {
    for (const [, wrapper] of this._providers) {
      await wrapper.createInstance();
    }
  }

  public async callOnInit(): Promise<void> {
    for (const [, provider] of this._providers) {
      await provider.callOnInit();
    }
  }

  public async callOnDidInit(): Promise<void> {
    for (const [, provider] of this._providers) {
      await provider.callOnDidInit();
    }
  }

  public resolveToken(
    token: Token,
    context: InjectionContext = DEFAULT_INJECTION_CONTEXT,
  ): ProviderWrapper {
    let wrapper: ProviderWrapper | undefined;

    // It's a direct provider
    if (this.providers.has(token)) {
      wrapper = this.providers.get(token);
    }

    // Try to resolve from imported modules
    if (wrapper == null) {
      wrapper = this._resolveFromImports(token, context);
    }

    // If wrapper is still null, try to resolve from the global module
    if (wrapper == null) {
      wrapper = this._container?.globalModule.providers.get(token);
    }

    // At this point, we tried to resolve from any possible place
    if (wrapper == null) {
      const name = typeof token === 'function' ? token.name : token.toString();
      throw new UndefinedDependencyException(name, this.name);
    }

    return wrapper;
  }

  private _resolveFromImports(
    token: Token,
    context: InjectionContext,
    visited: Array<Module> = [],
    module: Module = this,
  ): ProviderWrapper | undefined {
    const { imports } = module;

    for (const importedModule of imports) {
      if (!visited.includes(importedModule)) {
        visited.push(importedModule);
        const { exports, providers } = importedModule;

        if (exports.includes(token) && !providers.has(token)) {
          throw new Error(
            'Exported provided not found. Make sure it is added to the providers array.',
          );
        }

        if (exports.includes(token)) {
          return providers.get(token);
        } else {
          const wrapper = this._resolveFromImports(token, context, visited, importedModule);
          if (wrapper != null) return wrapper;
        }
      }
    }
  }
}
