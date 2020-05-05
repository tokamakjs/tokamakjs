import { ForwardReference } from '../types';

export function forwardRef(forwardRef: () => any): ForwardReference {
  return { forwardRef };
}
