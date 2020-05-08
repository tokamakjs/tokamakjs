import { History } from 'history';

import { HISTORY } from '../../core/constants';
import { inject, injectable } from '../../decorators';

@injectable()
export class RouterService {
  constructor(@inject(HISTORY) private readonly history: History) {}

  public push(...args: Parameters<History['push']>): void {
    setTimeout(() => this.history.push(...args));
  }

  public replace(...args: Parameters<History['replace']>): void {
    setTimeout(() => this.history.replace(...args));
  }
}
