import { InvalidScopeException, UnknownElementException } from '../exceptions';
import { isFunction } from '../utils';
import { Container } from './container';
import { Scope } from './enums';
import { InstanceWrapper } from './instance-wrapper';
import { ProviderToken } from './provider';

interface FlatContainer {
  providers: Map<string, InstanceWrapper<unknown>>;
}

export class ContainerScanner {
  private _flatContainer: FlatContainer;

  constructor(private readonly _container: Container) {
    this._flatContainer = this.flattenContainer(_container);
  }

  public find<T = any, R = T>(token: ProviderToken<T>): R {
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

  public rescan(): void {
    this._flatContainer = this.flattenContainer(this._container);
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
