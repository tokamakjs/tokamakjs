import { RouterState } from './router-state';

export interface CanActivate {
  canActivate(state: RouterState, schedule: (fn: Function) => void): boolean | Promise<boolean>;
}
