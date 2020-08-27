import { Container } from './container';
import { ContainerScanner } from './container-scanner';
import { ProviderToken } from './provider';

export class ModuleRef {
  constructor(private readonly _container: Container) {}

  public get<T = any, R = any>(token: ProviderToken<T>): R {
    const _scanner = new ContainerScanner(this._container);
    return _scanner.find(token);
  }
}
