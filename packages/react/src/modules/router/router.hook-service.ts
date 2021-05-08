import { RouterService } from '@tokamakjs/common';
import { Location, To } from 'history';

import { HookService } from '../../decorators/hook-service.decorator';
import { useLocation, useNavigate, useParams } from '../../routing';

@HookService()
export class RouterHookService extends RouterService {
  private readonly _params = useParams();
  private readonly _location = useLocation();
  private readonly _navigate = useNavigate();

  get location(): Location {
    return this._location;
  }

  get rawQuery(): string {
    return this._location.search;
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
