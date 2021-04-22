import { Token } from '@tokamakjs/injection';
import { useEffect, useState } from 'react';

import { useDiContainer } from './use-di-container';

export function useResolve<T = unknown, R = T>(token: Token<T>): R | undefined {
  const [instance, setInstance] = useState<R>();
  const container = useDiContainer();

  useEffect(() => {
    const _resolve = async () => {
      const instance = await container.resolve<T, R>(token);
      setInstance(instance);
    };

    _resolve();
  }, [token]);

  return instance;
}
