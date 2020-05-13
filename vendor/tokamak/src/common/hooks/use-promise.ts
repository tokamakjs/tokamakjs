import { useState } from 'react';

interface Promiser<A extends Array<any>, R> {
  (...args: A): Promise<R>;
}

interface EnhancedPromiser<A extends Array<any>, R> {
  isPending: boolean;
  (...args: A): Promise<R>;
}

export function usePromise<A extends Array<any>, R>(
  promiser: Promiser<A, R>,
): EnhancedPromiser<A, R> {
  const [isPending, setIsPending] = useState(false);

  const proxy = new Proxy(promiser, {
    apply(target, thisArg, ...args) {
      setIsPending(true);
      const promise = (target as any).apply(thisArg, args);
      promise.then(() => setIsPending(false));
      return promise;
    },
    get(target, key) {
      return key === 'isPending' ? isPending : (target as any)[key];
    },
  });

  return (proxy as unknown) as EnhancedPromiser<A, R>;
}
