import { hasHooks, runHooks, runHooksSync } from '@tokamakjs/injection';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export function useMountLifeCycle(controller: any): void {
  useEffect(() => {
    if (!hasHooks(controller)) return;

    const onDidMountCbs = runHooksSync(controller, 'onDidMount').filter(
      (v) => typeof v === 'function' || v instanceof Promise,
    );

    return () => {
      const onWillUnmountHooks = controller.__hooks__.get('onWillUnmount') ?? [];
      const totalHooks = [...onWillUnmountHooks, ...onDidMountCbs];
      totalHooks.forEach(async (cb) => {
        cb = cb instanceof Promise ? await cb : cb;
        if (typeof cb === 'function') cb.apply(controller);
      });
    };
  }, []);
}

export function useRenderLifeCycle(controller: any): void {
  useLayoutEffect(() => {
    if (!hasHooks(controller, 'onDidRender')) return;
    runHooks(controller, 'onDidRender');
  });
}

export function useForceUpdate(): () => void {
  const [, setState] = useState();
  return useCallback(() => setState({} as any), []);
}

export { useLocation } from './router/hooks';
