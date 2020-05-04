import { CanActivate, RouterState } from 'vendor/tokamak';

export class IsAdminGuard implements CanActivate {
  canActivate(state: RouterState): boolean | Promise<boolean> {
    // if no permissions, throw an error that will be captured by
    // the errors handler
    return true;
  }
}
