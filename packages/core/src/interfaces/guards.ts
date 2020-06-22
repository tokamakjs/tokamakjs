import { RouterState } from './router-state';

export type Scheduler = (fn: Function) => void;

export interface CanActivate {
  canActivate(state: RouterState, schedule: Scheduler): boolean | Promise<boolean>;
}
