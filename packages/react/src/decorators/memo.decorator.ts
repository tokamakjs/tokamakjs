import { Reflector } from '../reflection';
import { DepsFn } from '../types';

export function memo(deps?: DepsFn): MethodDecorator {
  return (target: Object, key: PropertyKey) => {
    Reflector.setInMemoKeysMap(target, key, deps);
  };
}
