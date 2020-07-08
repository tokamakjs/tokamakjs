import { HISTORY, inject, injectable } from '@tokamakjs/core';
import { History } from 'history';
import qs from 'query-string';

@injectable()
export class RouterService {
  constructor(@inject(HISTORY) private readonly _history: History) {}

  get location() {
    return this._history.location;
  }

  get query() {
    const { search } = this._history.location;
    return qs.parse(search);
  }

  get rawQuery() {
    return this._history.location.search;
  }

  public push(...args: Parameters<History['push']>): void {
    this._history.push(...args);
  }

  public replace(...args: Parameters<History['replace']>): void {
    this._history.replace(...args);
  }
}
