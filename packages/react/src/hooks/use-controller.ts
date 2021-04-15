import { Class } from '@tokamakjs/injection';

import { useDiContainer } from './use-di-container';

export function useController<T>(Controller: Class<T>): T {
  const container = useDiContainer();
  return container.resolveDependencies(Controller);
}
