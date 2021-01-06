import { WRAPPER_KEY } from './constants';

export class ControllerWrapper<T = any> {
  private _refreshView?: () => void;

  constructor(controller: T) {
    Object.defineProperty(controller, WRAPPER_KEY, { get: () => this });
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
