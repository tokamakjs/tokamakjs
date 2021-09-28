import { Reflector } from '../reflection';
import { Class } from '../types';

/**
 * Binds a specific error type to the decorated error handler.
 *
 * ```ts
 * import { Catch, ErrorHandler } from '@tokamakjs/common';
 *
 * import { FooError } from './errors';
 *
 * @Catch(FooError)
 * export class FooErrorHandler extends ErrorHandler {}
 * ```
 *
 * @category Decorators
 *
 * @typeParam T - Type of the Error to capture.
 * @param error - Error class to capture.
 * @returns A {@link https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators | ClassDecorator} function.
 */
export function Catch<T extends Error = Error>(error: Class<T>): ClassDecorator {
  return (Target: Function) => {
    Reflector.addCatchDecoratorMetadata(Target, error);
  };
}
