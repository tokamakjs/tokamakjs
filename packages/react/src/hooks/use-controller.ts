import { Class, InvalidScopeError } from '@tokamakjs/injection';
import { useRef } from 'react';

import { InvalidControllerDependencyError, NoDecoratedControllerError } from '../errors';
import { DecoratedController, isDecoratedController } from '../types';
import { useDiContainer } from './use-di-container';

export function useController<T>(Controller: Class<T>): T {
  const instanceRef = useRef<DecoratedController<T>>();
  const container = useDiContainer();

  if (instanceRef.current == null) {
    try {
      const instance = container.resolveDependenciesSync(Controller);

      if (isDecoratedController(instance)) {
        instanceRef.current = instance;
      } else {
        throw new NoDecoratedControllerError(Controller.name);
      }
    } catch (err) {
      if (err instanceof InvalidScopeError) {
        throw new InvalidControllerDependencyError(Controller.name);
      }

      throw err;
    }
  }

  instanceRef.current?.__controller__.callHooks();

  return instanceRef.current;
}
