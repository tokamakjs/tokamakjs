import { useEffect } from 'react';

import { hasOnDidMount, hasOnDidRender, hasOnDidUnmount } from '../interfaces';

export function useMountLifeCycle(controller: any): void {
  useEffect(() => {
    if (hasOnDidMount(controller)) controller.onDidMount();

    return () => {
      if (hasOnDidUnmount(controller)) controller.onDidUnmount();
    };
  }, []);
}

export function useRenderLifeCycle(controller: any): void {
  useEffect(() => {
    if (hasOnDidRender(controller)) controller.onDidRender();
  });
}
