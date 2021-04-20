import { InvalidScopeError } from './errors';
import { DEFAULT_INJECTION_CONTEXT } from './injection-context';
import { Module } from './module';
import { ProviderWrapper } from './provider-wrapper';
import { Token } from './types';

export class ModuleRef {
  constructor(private readonly _module: Module) {}

  get container() {
    return this._module.container;
  }

  public get<T = unknown, R = T>(token: Token<T>): R {
    const provider = this._module.resolveToken(token) as ProviderWrapper<R>;

    if (provider == null) {
      throw new Error('Provider null');
    }

    if (provider.isTransient) {
      throw new InvalidScopeError(token);
    }

    return provider.getInstance(DEFAULT_INJECTION_CONTEXT);
  }
}
