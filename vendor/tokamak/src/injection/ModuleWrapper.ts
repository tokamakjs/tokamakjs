import { v4 } from 'uuid';

import { UnknownExportException } from '../exceptions';
import { Injectable, Provider, Type } from '../types';
import { InstanceWrapper } from './InstanceWrapper';

export class ModuleWrapper {
  public readonly name: string;
  public readonly id: string;
  public readonly imports = new Set<ModuleWrapper>();
  public readonly providers = new Map<string, InstanceWrapper<Injectable>>();
  public readonly exports = new Set<string>();

  constructor(public readonly metatype: Type, public readonly scope: Array<Type>) {
    this.id = v4();
    this.name = metatype.name;
  }

  public addRelatedModule(module: ModuleWrapper): void {
    this.imports.add(module);
  }

  public addProvider(provider: Provider): void {
    // TODO:
    this.providers.set(provider.name, new InstanceWrapper(provider, this));
  }

  public addExportedProviderOrModule(provider: Provider | Type): void {
    // Are we exporting a provider?
    if (this.providers.has(provider.name)) {
      this.exports.add(provider.name);
    }
    // Are we exporting an imported module?
    else if (this.isImportedModule(provider)) {
      this.exports.add(provider.name);
    }
    // We're exporting something that is not in the context
    else {
      throw new UnknownExportException(provider.name, this.metatype.name);
    }
  }

  public async createInstances(): Promise<void> {
    this.providers.forEach((provider) => {
      provider.createInstance(this.providers);
    });
  }

  private isImportedModule(metatype: Type): boolean {
    const names = Array.from(this.imports.values()).map((m) => m.metatype.name);
    return names.includes(metatype.name);
  }
}
