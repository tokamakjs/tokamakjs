import { Type, isFunction } from '../types';

const message = (name: string) =>
  `${name} is marked as a scoped provider. Transient scoped providers can't be used in combination with "get()" method. Please, use "resolve()" instead.`;

export class InvalidScopeException extends Error {
  constructor(token: Type | string | symbol) {
    const name = isFunction(token) ? token.name : token.toString();
    super(message(name));
  }
}
