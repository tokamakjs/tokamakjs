/**
 * Wraps every `console.log()` inside the decorated method in
 * a `console.group('label')` with the specified `label`.
 *
 * ```ts
 * import { groupLog } from '@tokamakjs/common';
 *
 * class Foo {
 *   @groupLog('foo')
 *   public bar() {
 *     console.log('bar');
 *   }
 * }
 * ```
 *
 * @category Decorators
 *
 * @param label - Label to be used for the group.
 * @returns A {@link https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators | MethodDecorator}.
 */
export function groupLog(label: string): MethodDecorator {
  return (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void => {
    const original = Reflect.get(target, key) as Function;

    descriptor.value = function (...args: Array<any>) {
      console.group(label);
      const result = original.apply(this, ...args);
      console.groupEnd();
      return result;
    };
  };
}
