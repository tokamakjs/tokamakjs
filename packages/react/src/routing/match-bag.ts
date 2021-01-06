import { RouteMatch } from './router';

export class MatchBag {
  private _matches = new Map<any, RouteMatch>();

  public addMatch(controller: any, match: RouteMatch): void {
    this._matches.set(controller, match);
  }

  public getMatch(controller: any): RouteMatch | undefined {
    return this._matches.get(controller);
  }

  public clear(): void {
    this._matches.clear();
  }
}
