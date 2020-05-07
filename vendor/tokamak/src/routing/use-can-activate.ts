import { useContext, useLayoutEffect, useState } from 'react';

import { delay } from '../common';
import { RouteTransitionContext } from './RouteTransition';

export function useCanActivate(...guards: any) {
  const { isLoading, startLoading, stopLoading } = useContext(RouteTransitionContext);
  const [canActivate, setCanActivate] = useState(false);

  useLayoutEffect(() => {
    const verifyCanActivate = async () => {
      startLoading();
      await delay(2000);
      setCanActivate(false);
      stopLoading();
    };

    verifyCanActivate();
  }, []);

  return { isLoading, canActivate };
}
