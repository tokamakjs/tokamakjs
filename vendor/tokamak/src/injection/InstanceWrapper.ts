import { Reflector } from '../reflection';
import { Type } from '../types';
import { Scope } from '../types';
import { ModuleWrapper } from './ModuleWrapper';

export class InstanceWrapper<T = any> {
  public readonly name: string;
  public instance?: T;

  constructor(
    public readonly metatype: Type<T>,
    public readonly host: ModuleWrapper,
    public readonly scope = Scope.SINGLETON,
  ) {
    this.name = metatype.name;
  }

  public createInstance(providers: Map<string, InstanceWrapper>): void {
    this.resolveConstructorParams();
  }

  private resolveConstructorParams() {
    const params = Reflector.getConstructorParameters(this.metatype);
  }
}
