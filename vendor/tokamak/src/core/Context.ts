import { Container, ModuleWrapper } from '../injection';
import { Type } from '../types';

export class Context {
  constructor(private readonly container: Container, private contextModule?: ModuleWrapper) {}

  public select<T>(metatype: Type<T>): Context {
    const { modules } = this.container;
    return new Context(this.container);
  }

  public get<T>(metatype: Type<T>) {}
}
