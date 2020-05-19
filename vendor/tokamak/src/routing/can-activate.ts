import { CanActivate, RouterState } from '../interfaces';

export function createCanActivate(guards: Array<CanActivate>): (state: RouterState) => boolean {
  return (state: RouterState) => {
    for (const guard of guards) {
      if (!guard.canActivate(state, (fn: Function) => setTimeout(fn))) {
        return false;
      }
    }

    return true;
  };
}
