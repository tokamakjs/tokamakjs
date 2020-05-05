import { ModuleMetadata } from '../decorators';
import { Type } from './type';

export interface DynamicModule extends ModuleMetadata {
  module: Type;
  global?: boolean;
}
