export interface ForwardReference<T = any> {
  forwardRef: T;
}

export function forwardRef(forwardRef: () => any): ForwardReference {
  return { forwardRef };
}
