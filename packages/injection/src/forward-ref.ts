import { ForwardReference } from './types';

export function forwardRef<T = unknown>(forwardRef: () => T): ForwardReference<T> {
  return { forwardRef };
}
