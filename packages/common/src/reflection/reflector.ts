import 'reflect-metadata';

import { ErrorHandler } from '../interfaces';
import { Class } from '../types';

export class Reflector {
  public static addCatchDecoratorMetadata<T extends Error>(
    Target: Function,
    error: T | Class<T>,
  ): void {
    Reflect.defineMetadata('self:decorators:catch', error, Target);
  }

  public static getCatchDecoratorMetadata<T extends Error = Error>(
    Target: Function,
  ): T | undefined {
    return Reflect.getMetadata('self:decorators:catch', Target);
  }

  public static addUseErrorHandlersDecoratorMetadata(
    Target: Function,
    handlers: Array<Class<ErrorHandler> | ErrorHandler>,
  ): void {
    Reflect.defineMetadata('self:decorators:useerrorhandlers', handlers, Target);
  }

  public static getUseErrorHandlersDecoratorMetadata(
    Target: Function,
  ): Array<Class<ErrorHandler> | ErrorHandler> {
    return Reflect.getMetadata('self:decorators:useerrorhandlers', Target) ?? [];
  }
}
