import { Reflector } from '../reflection';

export function state(target: Object, propertyKey: string | symbol): void {
  Reflector.addToStateKeys(target, propertyKey);
}
