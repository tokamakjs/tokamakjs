import { Promiser, TrackedCallback } from '../types';

/**
 * Decorates a method to keep track of the returned promise.
 *
 * The passed callback receives two arguments. The first one is the object that
 * contains the method itself and the second one is the pending status of the promise.
 *
 * ```ts
 *  class Foo {
 *    public isPending = false;
 *
 *    @tracked((self: Foo, isPending: boolean) => (self.isLoading = isPending))
 *    public async doSomethingAsync(): Promise<void> {
 *      await delay(1000);
 *    }
 *  }
 * ```
 *
 * @category Decorators
 *
 * @param cb - Callback to call when the status of the tracked promise changes.
 * @returns A {@link https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators | MethodDecorator}.
 */
export function tracked(cb: TrackedCallback) {
  return (target: any, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<Promiser>) => {
    const original = (target as any)[propertyKey];

    descriptor.value = function (...args) {
      cb(this, true);
      const result: Promise<any> = original.apply(this, args);
      result.then(() => {
        cb(this, false);
      });
      return result;
    };
  };
}
