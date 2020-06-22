import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Subject } from 'rxjs';

import { CanActivate, hasOnDidMount, hasOnDidRender, hasOnWillUnmount } from '../interfaces';
import { useRouterState } from './router';

export function useMountLifeCycle(controller: any): void {
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
}

export function useRenderLifeCycle(controller: any): void {
  useLayoutEffect(() => {
    if (hasOnDidRender(controller)) controller.onDidRender();
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
