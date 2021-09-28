import { ReactNode } from 'react';

import { Reflector } from '../reflection';

export abstract class ErrorHandler<T extends Error = Error> {
  // Use a static method instead of an instance method to prevent subclasses from overriding it
  // and allowing using it as an interface with the "implements" keyword.
  public static catches<T extends Error>(h: ErrorHandler<T>, error: Error): boolean {
    const ErrorClass = Reflector.getCatchDecoratorMetadata(h.constructor);
    return ErrorClass != null && error instanceof ErrorClass;
  }

  abstract catch?: (error: T) => void;
  abstract render?: (error: T) => ReactNode;
}
