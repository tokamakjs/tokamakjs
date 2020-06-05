import { CanActivate, OnDidMount, OnWillUnmount } from '../interfaces';

export const WRAPPER_KEY = Symbol('ControllerWrapper');

export class ControllerWrapper<T = any> implements OnDidMount, OnWillUnmount {
  private _refresh?: () => void;
  private _hasRendered = false;

  constructor(controller: T, private readonly _guards: Array<CanActivate>) {
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

  public setRefreshFunction(refresh: () => void): void {
    this._refresh = refresh;
  }

  public refresh(): void {
    if (this._refresh == null) {
      throw new Error('No refresh function set.');
    }

    this._refresh();
  }
}
