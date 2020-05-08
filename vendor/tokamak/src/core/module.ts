import { v4 } from 'uuid';

import { ModuleMetadata } from '../decorators';
import { CircularDependencyException, UnknownExportException } from '../exceptions';
import { hasOnDidInit, hasOnInit } from '../interfaces';
import { Reflector } from '../reflection';
import { RouteDefinition } from '../routing';
import {
  CustomProvider,
  Injectable,
  ModuleDefinition,
  Provider,
  Type,
  isClassProvider,
  isCustomProvider,
  isDynamicModule,
  isForwardReference,
  isFunction,
  isValueProvider,
} from '../types';
import { Container } from './container';
import { Scope } from './enums';
import { InstanceWrapper } from './instance-wrapper';

export class Module {
  public readonly name: string;
  public readonly id: string;
  public readonly host: InstanceWrapper<Injectable>;
  public readonly imports = new Set<Module>();
  public readonly providers = new Map<string, InstanceWrapper<Injectable>>();
  public readonly exports = new Set<string>();
  public container?: Container;
  private _isInitialized: boolean = false;

  constructor(public readonly metatype: Type, public readonly metadata: ModuleMetadata) {
    this.id = v4();
    this.name = metatype.name;
    this.host = new InstanceWrapper(this.name, this, {
      isResolved: false,
      metatype: this.metatype,
    });
  }

  get isInitialized() {
    return this._isInitialized;
  }

  static async from(moduleDef: ModuleDefinition): Promise<Module> {
    moduleDef = await moduleDef;

    if (isForwardReference(moduleDef)) {
      const metatype = moduleDef.forwardRef();
      const metadata = Reflector.getModuleMetadata(metatype);
      return new Module(metatype, metadata);
    } else if (isDynamicModule(moduleDef)) {
      const { module: metatype, ...metadata } = moduleDef;
      return new Module(metatype, metadata);
    } else {
      const metatype = moduleDef;
      const metadata = Reflector.getModuleMetadata(metatype);
      return new Module(metatype, metadata);
    }
  }

  public async init(): Promise<void> {
    if (this._isInitialized) {
      throw new Error('This module has already been initialized. This is probably an error.');
    }

    this.setProviders();
    this.setControllers();
    this.setExports();

    this._isInitialized = true;
  }

  public async createInstances(): Promise<void> {
    if (!this._isInitialized) {
      throw new Error('This module has not been initialized.');
    }

    const wrappers = Array.from(this.providers.values());
    await Promise.all(wrappers.map(async (wrapper) => await wrapper.createInstance()));
  }

  public async callOnInit(): Promise<void> {
    for (const [, provider] of this.providers) {
      const { defaultValue: value } = provider;
      if (hasOnInit(value)) {
        await value.onInit();
      }
    }
  }

  public async callOnDidInit(): Promise<void> {
    for (const [, provider] of this.providers) {
      const { defaultValue: value } = provider;
      if (hasOnDidInit(value)) {
        await value.onDidInit();
      }
    }
  }

  private setProviders(): void {
    const { providers = [] } = this.metadata;
    providers.forEach((provider) => this.addProvider(provider));
  }

  private setControllers(): void {
    const { routing = [] } = this.metadata;

    const addControllersFromRoute = (route: RouteDefinition) => {
      const { controller } = route;
      this.addProvider(controller);
    };

    routing.forEach((route) => {
      addControllersFromRoute(route);
      route.children.forEach((route) => addControllersFromRoute(route));
    });
  }

  private setExports(): void {
    const { exports = [] } = this.metadata;
    exports.forEach((provider) => this.addExportedProviderOrModule(provider));
  }

  private addProvider(provider: Provider): void {
    if (provider === undefined) throw new CircularDependencyException();
    if (isCustomProvider(provider)) {
      this.addCustomProvider(provider);
    } else {
      const name = this.getProviderName(provider);
      this.providers.set(
        provider.name,
        new InstanceWrapper(name, this, {
          isResolved: false,
          metatype: provider,
          scope: Scope.SINGLETON,
        }),
      );
    }
  }

  private addCustomProvider(provider: CustomProvider) {
    if (isClassProvider(provider)) {
      const { useClass } = provider;
      const name = this.getProviderName(provider);
      this.providers.set(
        name,
        new InstanceWrapper(name, this, {
          isResolved: false,
          metatype: useClass,
          scope: Scope.SINGLETON,
        }),
      );
    } else if (isValueProvider(provider)) {
      const { useValue } = provider;
      const name = this.getProviderName(provider);
      this.providers.set(
        name,
        new InstanceWrapper(name, this, {
          isResolved: true,
          instance: useValue,
          scope: Scope.SINGLETON,
          isAsync: useValue instanceof Promise,
        }),
      );
    } else {
      const { useFactory, scope, inject = [] } = provider;
      const name = this.getProviderName(provider);
      this.providers.set(
        name,
        new InstanceWrapper(name, this, {
          isResolved: false,
          metatype: useFactory as any,
          scope,
          inject,
        }),
      );
    }
  }

  private addExportedProviderOrModule(provider: Provider | Type): void {
    const name = this.getProviderName(provider);

    if (this.providers.has(name)) {
      this.exports.add(name);
    } else if (this.isImportedModule(name)) {
      this.exports.add(name);
    } else {
      throw new UnknownExportException(name, this.metatype.name);
    }
  }

  private isImportedModule(name: string): boolean {
    const names = Array.from(this.imports.values()).map((m) => m.metatype.name);
    return names.includes(name);
  }

  private getProviderName(provider: Provider): string {
    if (isCustomProvider(provider)) {
      const { provide } = provider;
      return isFunction(provide) ? provide.name : provide.toString();
    }

    return provider.name;
  }
}
