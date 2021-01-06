import { Injectable, inject } from '@tokamakjs/injection';
import { HISTORY, MATCH_BAG, MatchBag } from '@tokamakjs/react';
import { History, Location } from 'history';
import qs from 'query-string';

@Injectable()
export class RouterService {
  constructor(
    @inject(HISTORY) private readonly _history: History,
    @inject(MATCH_BAG) private readonly _matchBag: MatchBag,
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

  public getParams(controller: any): Record<string, string | undefined> {
    const match = this._matchBag.getMatch(controller) ?? { params: {} };
    return match.params;
  }

  public push(...args: Parameters<History['push']>): void {
    this._history.push(...args);
  }

  public replace(...args: Parameters<History['replace']>): void {
    this._history.replace(...args);
  }
}
