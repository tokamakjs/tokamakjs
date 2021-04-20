import { Token } from '../types';

export class InvalidScopeError extends Error {
  constructor(token: Token) {
    const name = typeof token === 'function' ? token.name : token.toString();
    super(
      `${name} is marked as a scoped provider. Transient scoped providers can't be used in combination with "get()" method. Please, use "resolve()" instead.`,
    );
  }
}
