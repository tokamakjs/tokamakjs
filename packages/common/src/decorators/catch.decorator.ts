import { ErrorHandler } from '../interfaces';
import { Reflector } from '../reflection';
import { Class } from '../types';

/**
 * Binds a specific error type to the decorated error handler.
 *
 * @example
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
 * @category Decorator
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

/** @internal */
Catch.getMetadata = <T extends Error = Error>(Target: Function): Class<T> | undefined => {
  return Reflector.getCatchDecoratorMetadata(Target);
};

/** @internal */
Catch.catches = (handler: ErrorHandler, error: Error): boolean => {
  const ErrorClass = Catch.getMetadata(handler.constructor);
  return ErrorClass != null && error instanceof ErrorClass;
};
