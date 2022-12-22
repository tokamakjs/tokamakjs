import { Class, InvalidScopeError } from '@tokamakjs/injection';

import { InvalidControllerDependencyError, NoDecoratedControllerError } from '../errors';
import { DecoratedController, isDecoratedController } from '../types';
import { useDiContainer } from './use-di-container';
import { useHooksContainer } from './use-hooks-container';

export function useResolveController<T>(Controller: Class<T>): DecoratedController<T> {
  const container = useDiContainer();

  try {
    const instance = container.resolveDepsSync(Controller);

    if (!isDecoratedController(instance)) {
      throw new NoDecoratedControllerError(Controller.name);
    }

    return useHooksContainer(instance);
  } catch (err) {
    if (err instanceof InvalidScopeError) {
      throw new InvalidControllerDependencyError(Controller.name);
    }

    throw err;
  }
}
