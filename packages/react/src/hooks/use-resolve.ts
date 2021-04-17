import { Token } from '@tokamakjs/injection';
import { useEffect, useState } from 'react';
import { useDiContainer } from './use-di-container';

type UseResolveOut<T> = [isLoading: true, instance: undefined] | [isLoading: false, instance: T];

export function useResolve<T = unknown, R = T>(token: Token<T>): UseResolveOut<R> {
  const [isLoading, setIsLoading] = useState(true);
  const [instance, setInstance] = useState<R>();
  const container = useDiContainer();

  useEffect(() => {
    const _resolve = async () => {
      if (instance == null) {
        setIsLoading(true);
        const instance = await container.resolve<T, R>(token);
        setInstance(instance);
        setIsLoading(false);
      }
    };

    _resolve();
  }, []);

  return isLoading ? [true, undefined] : [false, instance as R];
}
