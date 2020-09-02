import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Subject } from 'rxjs';

import { hasHooks } from '../decorators';
import { CanActivate, hasOnDidMount, hasOnDidRender, hasOnWillUnmount } from '../interfaces';
import { useRouterState } from './router';

export function useMountLifeCycle(controller: any): void {
  // Method
  useEffect(() => {
    let onDidMountCb: any;

    if (hasOnDidMount(controller)) {
      onDidMountCb = controller.onDidMount();
    }

    return () => {
      if (onDidMountCb != null && typeof onDidMountCb === 'function') onDidMountCb();
      if (hasOnWillUnmount(controller)) controller.onWillUnmount();
    };
  }, []);

  // Hooks
  useEffect(() => {
    if (!hasHooks(controller)) return;

    const onDidMountHooks = controller.__hooks__.get('onDidMount') ?? [];
    const onDidMountCbs = onDidMountHooks.map((hook) => hook());

    return () => {
      const onWillUnmountHooks = controller.__hooks__.get('onWillUnmount') ?? [];
      const totalHooks = [...onWillUnmountHooks, ...onDidMountCbs];
      totalHooks.forEach((cb) => cb());
    };
  }, []);
}

export function useRenderLifeCycle(controller: any): void {
  // Method
  useLayoutEffect(() => {
    if (hasOnDidRender(controller)) controller.onDidRender();
  });

  // Hooks
  useLayoutEffect(() => {
    if (!hasHooks(controller)) return;

    const onDidRenderHooks = controller.__hooks__.get('onDidRender') ?? [];
    onDidRenderHooks.forEach((hook) => hook());
  });
}

export function useTrackLoading(controller: any): boolean {
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    // Not a tracked controller
    if (controller.__isLoading$__ == null) {
      return;
    }

    const isLoading$ = controller.__isLoading$__ as Subject<boolean>;

    const subscription = isLoading$.subscribe((isLoading: boolean) => {
      setIsLoading(isLoading);
    });

    return () => subscription.unsubscribe();
  });

  return isLoading;
}

export function useGuards(guards: Array<CanActivate>): { isPending: boolean; forbidden: boolean } {
  const [state, setState] = useState({ isPending: true, forbidden: true });
  const routerState = useRouterState();

  const scheduler = (cb: Function) => setTimeout(cb);
  const results = guards.map((g) => g.canActivate(routerState, scheduler));
  const isAsync = results.some((r) => r instanceof Promise);

  useLayoutEffect(() => {
    if (!isAsync) return;

    Promise.all(results).then((results) => {
      const forbidden = results.some((canActivate) => !canActivate);
      setState({ isPending: false, forbidden });
    });
  }, []);

  if (!isAsync) {
    const forbidden = results.some((canActivate) => !canActivate);
    return { isPending: false, forbidden };
  }

  return state;
}

export function useForceUpdate(): () => void {
  const [, setState] = useState();
  return useCallback(() => setState({}), []);
}

export { useLocation } from './router/hooks';
