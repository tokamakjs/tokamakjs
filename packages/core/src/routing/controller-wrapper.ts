import { onDidMount, onWillUnmount } from '../decorators/controller-life-cycle';

export const WRAPPER_KEY = Symbol('ControllerWrapper');

export class ControllerWrapper<T = any> {
  private _refreshView?: () => void;
  private _hasRendered = false;

  constructor(controller: T) {
    Object.defineProperty(controller, WRAPPER_KEY, { get: () => this });
  }

  get hasRendered() {
    return this._hasRendered;
  }

  @onDidMount()
  public onDidMount(): void {
    this._hasRendered = true;
  }

  @onWillUnmount()
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
