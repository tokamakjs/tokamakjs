import { Reflector } from '../reflection';

export function ref(target: Object, propertyKey: string | symbol): void {
  Reflector.addToRefKeys(target, propertyKey);
}
