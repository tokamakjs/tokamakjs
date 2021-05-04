import { ErrorHandler } from '../interfaces';
import { Reflector } from '../reflection';
import { Class } from '../types';

export function UseErrorHandlers(
  ...handlers: Array<Class<ErrorHandler> | ErrorHandler>
): ClassDecorator {
  return (Target: Function) => {
    Reflector.addUseErrorHandlersDecoratorMetadata(Target, handlers);
  };
}

UseErrorHandlers.getMetadata = (Target: Function) => {
  return Reflector.getUseErrorHandlersDecoratorMetadata(Target);
};
