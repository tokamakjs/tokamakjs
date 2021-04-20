import { Token } from '../types';

export class UnknownElementError extends Error {
  constructor(token?: Token) {
    const name = typeof token === 'function' ? token.name : token?.toString();
    super(
      `Could not find ${
        name ?? 'given'
      } element (this provider does not exist in the current context)`,
    );
  }
}
