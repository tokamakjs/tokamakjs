import { OnDidMount, OnWillUnmount } from '../interfaces';

export const WRAPPER_KEY = Symbol('ControllerWrapper');

export class ControllerWrapper<T = any> implements OnDidMount, OnWillUnmount {
  private _refreshView?: () => void;
  private _hasRendered = false;

  constructor(controller: T) {
    Object.defineProperty(controller, WRAPPER_KEY, { get: () => this });
  }

  get hasRendered() {
    return this._hasRendered;
  }

  public onDidMount(): void {
    this._hasRendered = true;
  }

  public onWillUnmount(): void {
    this._hasRendered = false;
  }

  public setRefreshViewFunction(refresh: () => void): void {
    this._refreshView = refresh;
  }

  public refresh(): void {
    if (this._refreshView == null) {
      throw new Error('No refresh function set.');
    }

    this._refreshView();
  }
}
