import { Type } from './Type';

export interface Node {
  metatype: Type;
  scope: Array<Type>;
}
