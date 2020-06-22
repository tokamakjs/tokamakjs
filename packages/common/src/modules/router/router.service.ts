import { HISTORY, inject, injectable } from '@tokamakjs/core';
import { History } from 'history';

@injectable()
export class RouterService {
  constructor(@inject(HISTORY) private readonly history: History) {}

  public push(...args: Parameters<History['push']>): void {
    this.history.push(...args);
  }

  public replace(...args: Parameters<History['replace']>): void {
    this.history.replace(...args);
  }
}
