import { CanActivate, RouterState, injectable } from 'vendor/tokamak';
import { RouterService } from 'vendor/tokamak';

import { LocalStorageService } from '../services';

@injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly localStorage: LocalStorageService,
    private readonly router: RouterService,
  ) {}

  public canActivate(state: RouterState): boolean {
    const token = this.localStorage.getAuthToken();

    if (token != null) {
      return true;
    }

    // this.router.replace(`/auth/login?return=${state.location.pathname}`);
    this.router.replace(`/auth/login`);
    return false;
  }
}
