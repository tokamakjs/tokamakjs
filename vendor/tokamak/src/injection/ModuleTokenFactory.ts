import { v4 } from 'uuid';

import { Type } from '../types';

export class ModuleTokenFactory {
  private readonly tokenCache = new WeakMap<Type, string>();

  public getToken(MetaType: Type): string {
    let id = this.tokenCache.get(MetaType);
    if (id != null) return id;
    id = v4();
    this.tokenCache.set(MetaType, id);
    return id;
  }
}
