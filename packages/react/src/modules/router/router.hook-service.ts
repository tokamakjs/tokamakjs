import { RouterService } from '@tokamakjs/common';
import { Location, To } from 'history';

import { HookService } from '../../decorators/hook-service.decorator';
import { useLocation, useNavigate, useParams } from '../../routing';
import { hook } from '../../utils';

@HookService()
export class RouterHookService extends RouterService {
  private readonly _params = hook(() => useParams());
  private readonly _location = hook(() => useLocation());
  private readonly _navigate = hook(() => useNavigate());

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
    this._navigate(to, { state });
  }

  public replace(to: To, state?: object | null | undefined): void {
    this._navigate(to, { state, replace: true });
  }
}
