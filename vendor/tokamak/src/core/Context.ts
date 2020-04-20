import { Container, ContainerScanner, ModuleWrapper } from '../injection';
import { Type } from '../types';

export class Context {
  private readonly containerScanner: ContainerScanner;

  constructor(private readonly container: Container, private contextModule?: ModuleWrapper) {
    this.containerScanner = new ContainerScanner(container);
  }

  public select<T>(metatype: Type<T>): Context {
    const { modules } = this.container;
  }

  public get<T>(metatype: Type<T>) {}
}
