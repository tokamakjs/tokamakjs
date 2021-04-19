import { RouterService } from '@tokamakjs/common';
import { Location, To } from 'history';

import { HookService } from '../../decorators/hook-service.decorator';
import { useLocation, useParams } from '../../routing';
import { hook } from '../../utils';

@HookService()
export class RouterHookService extends RouterService {
  private readonly _params = hook(() => useParams());
  private readonly _location = hook(() => useLocation());

  get location(): Location {
    return this._location;
  }

  get rawQuery() {
    return '';
  }

  public getParams(): Record<string, string | undefined> {
    return this._params;
  }

  public push(to: To, state?: object | null | undefined): void {
    throw new Error('Method not implemented.');
  }

  public replace(to: To, state?: object | null | undefined): void {
    throw new Error('Method not implemented.');
  }
}
