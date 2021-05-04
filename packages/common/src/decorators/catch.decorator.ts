import { Reflector } from '../reflection';
import { Class } from '../types';

export function Catch<T extends Error = Error>(error: T | Class<T>) {
  return (Target: Function) => {
    Reflector.addCatchDecoratorMetadata(Target, error);
  };
}

Catch.getMetadata = <T extends Error = Error>(Target: Function): T | undefined => {
  return Reflector.getCatchDecoratorMetadata(Target);
};
