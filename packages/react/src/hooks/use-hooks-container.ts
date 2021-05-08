import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { HooksContainer } from '../types';

export function _useForceUpdate(): () => void {
  const [, dispatch] = useState({});
  return useCallback(() => dispatch({}), [dispatch]);
}

export function useHooksContainer<T>(inst: HooksContainer<T>): HooksContainer<T> {
  const { stateKeys, refKeys, effectKeysMap, memoKeysMap } = inst.__reactHooks__;
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

  memoKeysMap.forEach((depsFn, key) => {
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(inst), key);
    const { get = () => {} } = desc ?? {};

    const hookBody = get.bind(inst);
    const deps = depsFn(inst);

    const value = useMemo(() => hookBody(), deps);

    Object.defineProperty(inst, key, {
      get: () => value,
      set: () => false,
    });
  });

  return inst;
}
