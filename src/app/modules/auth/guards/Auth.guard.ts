import { CanActivate, RouterState } from 'vendor/tokamak';

import { LocalStorageService } from '../services';

export class AuthGuard implements CanActivate {
  constructor(private readonly localStorage: LocalStorageService) {}

  public canActivate(state: RouterState): boolean | Promise<boolean> {
    const token = this.localStorage.getAuthToken();

    if (token != null) {
      return true;
    }

    // this.router.push('/login', { query: { return: state.url } });
    return false;
  }
}
