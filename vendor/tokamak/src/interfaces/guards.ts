import { RouterState } from './router-state';

export interface CanActivate {
  canActivate(state: RouterState): boolean | Promise<boolean>;
}
