import { ComponentType, ReactElement, createElement } from 'react';

import { delay } from '../common';

export class ControllerWrapper<T = any> {
  private _viewHolder?: ComponentType;
  private _refreshFunction?: () => void;
  private _isDirty = true;

  constructor(private readonly controller: T) {
    Object.defineProperty(controller, 'wrapper', {
      configurable: true,
      enumerable: true,
      get: () => this,
    });

    console.log(controller);
  }

  setViewHolder(viewHolder: ComponentType): void {
    this._viewHolder = viewHolder;
  }

  setRefreshFunction(refresh: () => void): void {
    this._refreshFunction = refresh;
  }

  get needsRefresh() {
    return this._isDirty;
  }

  refresh(): void {
    if (this._refreshFunction == null) {
      throw new Error('No refresh function set.');
    }
    console.log('is dirty again');
    this._isDirty = true;
    return this._refreshFunction();
  }

  async render() {
    this._isDirty = false;
    console.log('Render');
    await delay(2000);
    return createElement(this._viewHolder!);
  }
}
