import { Class, InvalidScopeException } from '@tokamakjs/injection';

import { InvalidControllerDependencyException } from '../exceptions';
import { useDiContainer } from './use-di-container';

export function useController<T>(Controller: Class<T>): T {
  const container = useDiContainer();
  try {
    return container.resolveDependenciesSync(Controller);
  } catch (err) {
    if (err instanceof InvalidScopeException) {
      throw new InvalidControllerDependencyException(Controller.name);
    }

    throw err;
  }
}
