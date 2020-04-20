import { Reflector } from '../reflection';
import { isFunction } from '../types';

function _sanitizeToken(target: Object, key: string | symbol, token?: any): any {
  if (token == null) {
    token = Reflector.getTypeOfProperty(target, key);
  }

  return isFunction(token) ? token.name : token;
}

export function inject<T = any>(token?: T): ParameterDecorator {
  return (target: Object, key: string | symbol, index: number): void => {
    token = _sanitizeToken(target, key, token);

    // We have to work with the index instead of the token because when
    // reflecting the constructor parameters, we're only gonna get an array
    // so we won't have a way of matching a key with a paramter
    Reflector.addManuallyInjectedDeps(target, [{ index, token }]);
  };
}
