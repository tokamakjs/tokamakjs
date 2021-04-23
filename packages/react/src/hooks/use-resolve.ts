import { Token } from '@tokamakjs/injection';
import { useEffect, useState } from 'react';

import { HookService } from '../decorators';
import { useDiContainer } from './use-di-container';

export function useResolve<T = unknown, R = T>(token: Token<T>): R | undefined {
  const [instance, setInstance] = useState<R>();
  const container = useDiContainer();

  if (HookService.isHookService(token)) {
    return container.resolveSync<T, R>(token);
  }

  useEffect(() => {
    const _resolve = async () => {
      const instance = await container.resolve<T, R>(token);
      setInstance(instance);
    };

    _resolve();
  }, [token]);

  return instance;
}
