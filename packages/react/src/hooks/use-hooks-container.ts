import { useCallback, useEffect, useRef, useState } from 'react';

import { HooksContainer } from '../types';

export function _useForceUpdate(): () => void {
  const [, dispatch] = useState({});
  return useCallback(() => dispatch({}), [dispatch]);
}

export function useHooksContainer<T>(inst: HooksContainer<T>): T {
  const { stateKeys, refKeys, effectKeysMap } = inst.__reactHooks__;
  const forceUpdate = _useForceUpdate();

  stateKeys.forEach((key) => {
    const ref = useRef((inst as any)[key]);
    Object.defineProperty(inst, key, {
      get: () => ref.current,
      set: (v) => {
        ref.current = v;
        forceUpdate();
      },
    });
  });

  refKeys.forEach((key) => {
    const ref = useRef((inst as any)[key]);
    Object.defineProperty(inst, key, {
      get: () => ref.current,
      set: (v) => (ref.current = v),
    });
  });

  effectKeysMap.forEach((depsFn, key) => {
    const hookBody = (inst as any)[key].bind(inst);
    const deps = depsFn(inst);

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

  return inst;
}
