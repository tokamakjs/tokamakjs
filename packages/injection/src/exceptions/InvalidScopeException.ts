import { Token } from '../types';

const message = (name: string) =>
  `${name} is marked as a scoped provider. Transient scoped providers can't be used in combination with "get()" method. Please, use "resolve()" instead.`;

export class InvalidScopeException extends Error {
  constructor(token: Token) {
    const name = typeof token === 'function' ? token.name : token.toString();
    super(message(name));
  }
}
