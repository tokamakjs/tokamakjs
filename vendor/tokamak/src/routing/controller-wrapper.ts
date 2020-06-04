import { ComponentType, ReactElement, createElement } from 'react';

import { CanActivate, OnDidMount, OnWillUnmount } from '../interfaces';

export const WRAPPER_KEY = Symbol('ControllerWrapper');

export class ControllerWrapper<T = any> implements OnDidMount, OnWillUnmount {
  private _viewHolder?: ComponentType;
  private _refresh?: () => void;
  private _hasRendered = false;

  constructor(controller: T, private readonly _guards: Array<CanActivate>) {
    Object.defineProperty(controller, WRAPPER_KEY, { get: () => this });
  }

  get shouldRender() {
    return !this._hasRendered;
  }

  public onDidMount(): void {
    this._hasRendered = true;
  }

  public onWillUnmount(): void {
    this._hasRendered = false;
  }

  public setViewHolder(viewHolder: ComponentType): void {
    this._viewHolder = viewHolder;
  }

  public setRefreshFunction(refresh: () => void): void {
    this._refresh = refresh;
  }

  public refresh(): void {
    if (this._refresh == null) {
      throw new Error('No refresh function set.');
    }

    this._refresh();
  }

  public async render(): Promise<ReactElement> {
    const element = createElement(this._viewHolder!);
    this._hasRendered = true;
    return element;
  }
}
