import { Class, InvalidScopeError } from '@tokamakjs/injection';
import { useEffect, useRef, useState } from 'react';

import { InvalidControllerDependencyError, NoDecoratedControllerError } from '../errors';
import { DecoratedController, isDecoratedController } from '../types';
import { useDiContainer } from './use-di-container';

function _useControllerHooks<T>(ctrl: DecoratedController<T>): T {
  const { stateKeys, refKeys, effectKeysMap } = ctrl.__controller__;

  stateKeys.forEach((key) => {
    const state = useState((ctrl as any)[key]);
    Object.defineProperty(ctrl, key, {
      get: () => state[0],
      set: (v) => state[1](v),
    });
  });

  refKeys.forEach((key) => {
    const ref = useRef((ctrl as any)[key]);
    Object.defineProperty(ctrl, key, {
      get: () => ref.current,
      set: (v) => (ref.current = v),
    });
  });

  effectKeysMap.forEach((depsFn, key) => {
    const hookBody = (ctrl as any)[key].bind(ctrl);
    const deps = depsFn(ctrl);

    useEffect(() => {
      const returnValue = hookBody();

      return () => {
        if (typeof returnValue === 'function') {
          return returnValue();
        } else if (returnValue instanceof Promise) {
          return returnValue.then((cb) => cb());
        }
      };
    }, deps);
  });

  return ctrl;
}

export function useController<T>(Controller: Class<T>): T {
  const container = useDiContainer();

  try {
    const instance = container.resolveDependenciesSync(Controller);

    if (!isDecoratedController(instance)) {
      throw new NoDecoratedControllerError(Controller.name);
    }

    return _useControllerHooks(instance);
  } catch (err) {
    if (err instanceof InvalidScopeError) {
      throw new InvalidControllerDependencyError(Controller.name);
    }

    throw err;
  }
}
