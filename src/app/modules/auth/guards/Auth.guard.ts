import { CanActivate } from 'vendor/tokamak';

import { LocalStorageService } from '../services';

export class AuthGuard implements CanActivate {
  constructor(private readonly localStorage: LocalStorageService) {}

  public canActivate(): boolean {
    const token = this.localStorage.getAuthToken();
    return token != null;
  }
}
