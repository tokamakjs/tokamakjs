import { BehaviorSubject, Subject } from 'rxjs';

type Promiser = (...args: any) => Promise<any>;

export type Tracked<T> = T & {
  __isPending$__: Subject<boolean>;
};

export function tracked(
  target: Object,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<Promiser>,
) {
  const isPending$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  Object.defineProperty(target, '__isPending$__', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: isPending$,
  });

  const original = (target as any)[key];

  descriptor.value = function (...args) {
    isPending$.next(true);
    const result: Promise<any> = original.apply(this, args);

    result.then(() => {
      isPending$.next(false);
    });

    return result;
  };
}
