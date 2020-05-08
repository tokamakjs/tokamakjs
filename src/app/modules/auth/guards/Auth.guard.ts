import { CanActivate, RouterState, injectable } from 'vendor/tokamak';

import { LocalStorageService } from '../services';

@injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly localStorage: LocalStorageService) {}

  public async canActivate(state: RouterState): Promise<boolean> {
    const token = this.localStorage.getAuthToken();

    if (token != null) {
      return true;
    }

    console.log(state);

    // this.router.push('/login', { query: { return: state.url } });
    return false;
  }
}
