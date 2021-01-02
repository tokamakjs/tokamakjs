import { Module } from './module';

export class ModuleRef {
  constructor(private readonly _module: Module) {}

  get container() {
    return this._module.container;
  }
}
