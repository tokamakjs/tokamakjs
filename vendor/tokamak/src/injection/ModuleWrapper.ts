import { v4 } from 'uuid';

import { UnknownExportException } from '../exceptions';
import { Injectable, Provider, Type } from '../types';
import { InstanceWrapper } from './InstanceWrapper';

export class ModuleWrapper {
  public readonly name: string;
  public readonly id: string;
  private readonly _imports = new Set<ModuleWrapper>();
  // Map => providerName: InstanceWrapper(Provider)
  private readonly _providers = new Map<string, InstanceWrapper<Injectable>>();
  private readonly _exports = new Set<string>();

  constructor(public readonly metatype: Type, public readonly scope: Array<Type>) {
    this.id = v4();
    this.name = metatype.name;
  }

  public addRelatedModule(module: ModuleWrapper): void {
    this._imports.add(module);
  }

  public addProvider(provider: Provider): void {
    // TODO:
    this._providers.set(provider.name, new InstanceWrapper());
  }

  public addExportedProviderOrModule(provider: Provider | Type): void {
    // TODO:
    // Are we exporting a provider?
    if (this._providers.has(provider.name)) {
      this._exports.add(provider.name);
    }
    // Are we exporting an imported module?
    else if (this.isImportedModule(provider)) {
      this._exports.add(provider.name);
    }
    // We're exporting something that is not in the context
    else {
      throw new UnknownExportException(provider.name, this.metatype.name);
    }
  }

  private isImportedModule(metatype: Type): boolean {
    const names = Array.from(this._imports.values()).map((m) => m.metatype.name);
    return names.includes(metatype.name);
  }
}
