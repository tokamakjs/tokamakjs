export interface ForwardReference<T = any> {
  forwardRef: T;
}

export function forwardRef(forwardRef: () => any): ForwardReference {
  return { forwardRef };
}

export function isForwardReference(module: any): module is ForwardReference {
  return module != null && (module as ForwardReference).forwardRef != null;
}
