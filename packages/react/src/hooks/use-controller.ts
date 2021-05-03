import { Class, InvalidScopeError } from '@tokamakjs/injection';
import { useContext } from 'react';

import { InvalidControllerDependencyError, NoDecoratedControllerError } from '../errors';
import { ControllerContext } from '../routing';
import { DecoratedController, isDecoratedController } from '../types';
import { useDiContainer } from './use-di-container';
import { useHooksContainer } from './use-hooks-container';

export function useController<T>(): T {
  const ctrl = useContext<T>(ControllerContext);

  if (ctrl == null) {
    throw new Error('Controller not found.');
  }

  return ctrl;
}

export function useResolveController<T>(Controller: Class<T>): DecoratedController<T> {
  const container = useDiContainer();

  try {
    const instance = container.resolveDependenciesSync(Controller);

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
