import { ComponentType, ReactElement, createElement } from 'react';

import { CanActivate, OnDidMount, OnDidUnmount } from '../interfaces';

export const WRAPPER_KEY = Symbol('ControllerWrapper');

export class ControllerWrapper<T = any> implements OnDidMount, OnDidUnmount {
  private _viewHolder?: ComponentType;
  private _triggerRender?: () => void;
  private _isDirty = true;

  constructor(controller: T, private readonly _guards: Array<CanActivate>) {
    Object.defineProperty(controller, WRAPPER_KEY, { get: () => this });
  }

  get shouldRefresh() {
    return this._isDirty;
  }

  public onDidMount(): void {}

  public onDidUnmount(): void {
    this._isDirty = true;
  }

  public setViewHolder(viewHolder: ComponentType): void {
    this._viewHolder = viewHolder;
  }

  public setRefreshFunction(refresh: () => void): void {
    this._triggerRender = refresh;
  }

  public refresh(): void {
    if (this._triggerRender == null) {
      throw new Error('No refresh function set.');
    }

    this._isDirty = true;
    this._triggerRender();
  }

  public async render(): Promise<ReactElement> {
    this._isDirty = false;
    return createElement(this._viewHolder!);
  }
}
