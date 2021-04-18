import { Class, InvalidScopeException } from '@tokamakjs/injection';
import { useRef } from 'react';

import {
  InvalidControllerDependencyException,
  NoDecoratedControllerException,
} from '../exceptions';
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
        throw new NoDecoratedControllerException(Controller.name);
      }
    } catch (err) {
      if (err instanceof InvalidScopeException) {
        throw new InvalidControllerDependencyException(Controller.name);
      }

      throw err;
    }
  } else {
    instanceRef.current?.__controller__.callHooks();
  }

  return instanceRef.current;
}
