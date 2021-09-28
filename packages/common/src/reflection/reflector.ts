import 'reflect-metadata';

import { Class } from '../types';

export class Reflector {
  public static addCatchDecoratorMetadata<T extends Error>(
    Target: Function,
    error: Class<T>,
  ): void {
    Reflect.defineMetadata('self:decorators:catch', error, Target);
  }

  public static getCatchDecoratorMetadata<T extends Error = Error>(
    Target: Function,
  ): Class<T> | undefined {
    return Reflect.getMetadata('self:decorators:catch', Target);
  }
}
