import { BehaviorSubject, Subject } from 'rxjs';

type PromiseReturningFn = (...args: any) => Promise<any>;

export function tracked(
  target: Object,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<PromiseReturningFn>,
) {
  let isLoading$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  Object.defineProperty(target, '__isLoading$__', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: isLoading$,
  });

  const original = (target as any)[key];

  descriptor.value = function (...args) {
    isLoading$.next(true);
    const result: Promise<any> = original.apply(this, args);

    result.then(() => {
      isLoading$.next(false);
    });

    return result;
  };
}
