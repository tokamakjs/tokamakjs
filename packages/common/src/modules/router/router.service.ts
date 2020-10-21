import { HISTORY, MATCH_BAG, RouteMatch, inject, injectable } from '@tokamakjs/core';
import { History, Location } from 'history';
import qs from 'query-string';

@injectable()
export class RouterService {
  constructor(
    @inject(HISTORY) private readonly _history: History,
    @inject(MATCH_BAG) private readonly _matchBag: { match?: Omit<RouteMatch, 'route'> },
  ) {}

  get location(): Location {
    return this._history.location as Location;
  }

  get query() {
    const { search } = this._history.location;
    return qs.parse(search);
  }

  get rawQuery() {
    return this._history.location.search;
  }

  get match() {
    return this._matchBag.match ?? {};
  }

  public push(...args: Parameters<History['push']>): void {
    this._history.push(...args);
  }

  public replace(...args: Parameters<History['replace']>): void {
    this._history.replace(...args);
  }
}
