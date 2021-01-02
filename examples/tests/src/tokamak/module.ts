import { DiContainer } from './di-container';
import { ProviderWrapper } from './provider-wrapper';
import { Reflector } from './reflection';
import {
  ModuleDefinition,
  ModuleMetadata,
  Token,
  isDynamicModule,
  isForwardReference,
} from './types';
import { runHooks } from './utils/hooks';

export class Module {
  private readonly _providers: Map<Token, ProviderWrapper<unknown>> = new Map();
  private readonly _exports: Map<Token, ProviderWrapper<unknown>> = new Map();

  private _container?: DiContainer;

  constructor(
    private readonly _metadata: Required<ModuleMetadata>,
    private readonly _imports: Array<Module>,
  ) {}

  public static async getMetadata<T>(
    moduleDef: ModuleDefinition<T>,
  ): Promise<Required<ModuleMetadata>> {
    moduleDef = await moduleDef;

    if (isForwardReference(moduleDef)) {
      const forwardedModule = moduleDef.forwardRef();
      return Module.getMetadata(forwardedModule);
    } else if (isDynamicModule(moduleDef)) {
      const { module, ...metadata } = { providers: [], imports: [], exports: [], ...moduleDef };
      return metadata;
    } else {
      const metadata = Reflector.getModuleMetadata(moduleDef);
      return metadata;
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
    return this._exports;
  }

  public async createInstances(): Promise<void> {
    const { providers } = this._metadata;
    for (const provider of providers) {
      const wrapper = new ProviderWrapper(this, provider);
      await wrapper.createInstance();
      this._providers.set(wrapper.key, wrapper);
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
}
