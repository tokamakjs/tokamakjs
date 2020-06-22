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
): [EnhancedPromiser<A, R>, boolean, R | undefined] {
  const [status, setStatus] = useState<{ isPending: boolean; result?: R }>({ isPending: false });

  const setIsPending = () => setStatus({ isPending: true });

  const proxy = new Proxy(promiser, {
    apply(target, thisArg, ...args) {
      setIsPending();
      const promise = (target as any).apply(thisArg, args);

      promise.then((result: R) => {
        setStatus({ isPending: false, result });
      });

      return promise;
    },
    get(target, key) {
      return key === 'isPending' ? status.isPending : (target as any)[key];
    },
  });

  return [(proxy as unknown) as EnhancedPromiser<A, R>, status.isPending, status.result];
}
