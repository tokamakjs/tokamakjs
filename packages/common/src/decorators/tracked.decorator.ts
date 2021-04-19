import { Promiser, TrackedCallback } from '../types';

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
