import { History, Location } from 'history';

export abstract class RouterService<P = Record<string, string | undefined>> {
  abstract location: Location;
  abstract rawQuery: string;
  abstract getParams(controller: unknown): P;
  abstract push(...args: Parameters<History['push']>): void;
  abstract replace(...args: Parameters<History['replace']>): void;

  get query(): URLSearchParams {
    return new URLSearchParams(this.rawQuery);
  }
}
