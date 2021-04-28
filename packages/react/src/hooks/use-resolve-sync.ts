import { Token } from '@tokamakjs/injection';

import { useDiContainer } from './use-di-container';

export function useResolveSync<T = unknown, R = T>(token: Token<T>): R {
  const container = useDiContainer();
  return container.resolveSync<T, R>(token);
}
