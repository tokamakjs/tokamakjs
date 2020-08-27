import { ProviderToken } from '../injection';
import { isFunction } from '../utils';

const message = (name: string) =>
  `${name} is marked as a scoped provider. Transient scoped providers can't be used in combination with "get()" method. Please, use "resolve()" instead.`;

export class InvalidScopeException extends Error {
  constructor(token: ProviderToken) {
    const name = isFunction(token) ? token.name : token.toString();
    super(message(name));
  }
}
