import { CanActivate, RouterState } from '../interfaces';
import { Readable, wrapPromise } from './wrap-promise';

export function createCanActivate(
  guards: Array<CanActivate>,
): (state: RouterState) => Readable<boolean> {
  return (state: RouterState) => {
    const promise = async (state: RouterState): Promise<boolean> => {
      for (const guard of guards) {
        if (!(await guard.canActivate(state))) {
          return false;
        }
      }

      return true;
    };

    return wrapPromise(promise(state));
  };
}
