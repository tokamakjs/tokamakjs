import { History, Location } from 'history';
import qs, { ParsedQuery } from 'query-string';

export abstract class RouterService<
  P = Record<string, string | undefined>,
  Q extends ParsedQuery = ParsedQuery
> {
  abstract location: Location;
  abstract rawQuery: string;
  abstract getParams(controller: unknown): P;
  abstract push(...args: Parameters<History['push']>): void;
  abstract replace(...args: Parameters<History['replace']>): void;

  get query(): Q {
    return qs.parse(this.rawQuery) as Q;
  }
}
