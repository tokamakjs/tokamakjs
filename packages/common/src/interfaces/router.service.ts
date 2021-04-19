import { History, Location } from 'history';
import qs, { ParsedQuery } from 'query-string';

export abstract class RouterService {
  abstract location: Location;
  abstract rawQuery: string;
  abstract getParams(controller: unknown): Record<string, string | undefined>;
  abstract push(...args: Parameters<History['push']>): void;
  abstract replace(...args: Parameters<History['replace']>): void;

  get query(): ParsedQuery {
    return qs.parse(this.rawQuery);
  }
}
