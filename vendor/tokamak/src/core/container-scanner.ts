import { InvalidScopeException, UnknownElementException } from '../exceptions';
import { Type, isFunction } from '../types';
import { Container } from './container';
import { Scope } from './enums';
import { InstanceWrapper } from './instance-wrapper';

interface FlatContainer {
  providers: Map<string, InstanceWrapper<unknown>>;
}

export class ContainerScanner {
  private readonly _flatContainer: FlatContainer;

  constructor(_container: Container) {
    this._flatContainer = this.flattenContainer(_container);
  }

  public find<T = any, R = T>(token: Type<T> | string | symbol): R {
    const name = isFunction(token) ? token.name : token;
    const instanceWrapper = this._flatContainer.providers.get(name as string);

    if (instanceWrapper == null) {
      throw new UnknownElementException(name.toString());
    }

    if (instanceWrapper.scope === Scope.TRANSIENT) {
      throw new InvalidScopeException(token);
    }

    return (instanceWrapper.defaultValue as unknown) as R;
  }

  private flattenContainer(container: Container): FlatContainer {
    const { modules } = container;
    const flatContainer = { providers: new Map<string, InstanceWrapper<unknown>>() };

    return Array.from(modules.values()).reduce((memo, module) => {
      memo.providers = new Map([...memo.providers, ...module.providers]);
      return memo;
    }, flatContainer);
  }
}
