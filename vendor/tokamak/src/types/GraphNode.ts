import { ModuleMetadata } from '../decorators';
import { Type } from './Type';

export interface GraphNode extends ModuleMetadata {
  metatype: Type;
  scope: Array<Type>;
}
