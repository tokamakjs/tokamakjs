import { ErrorHandler } from 'src/interfaces';

import { Reflector } from '../reflection';
import { Class } from '../types';

export function Catch<T extends Error = Error>(error: Class<T>) {
  return (Target: Function) => {
    Reflector.addCatchDecoratorMetadata(Target, error);
  };
}

Catch.getMetadata = <T extends Error = Error>(Target: Function): Class<T> | undefined => {
  return Reflector.getCatchDecoratorMetadata(Target);
};

Catch.catches = (handler: ErrorHandler, error: Error): boolean => {
  const ErrorClass = Catch.getMetadata(handler.constructor);
  return ErrorClass != null && error instanceof ErrorClass;
};
