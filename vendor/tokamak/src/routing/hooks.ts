import { useEffect, useLayoutEffect, useState } from 'react';
import { Subject } from 'rxjs';

import { hasOnDidMount, hasOnDidRender, hasOnDidUnmount } from '../interfaces';

export function useMountLifeCycle(controller: any, skip: boolean): void {
  useEffect(() => {
    if (skip) return;
    if (hasOnDidMount(controller)) controller.onDidMount();

    return () => {
      if (skip) return;
      if (hasOnDidUnmount(controller)) controller.onDidUnmount();
    };
  }, []);
}

export function useRenderLifeCycle(controller: any, skip: boolean): void {
  useLayoutEffect(() => {
    if (skip) return;
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
