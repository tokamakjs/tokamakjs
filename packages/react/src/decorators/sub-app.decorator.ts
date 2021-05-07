import { Reflector } from '../reflection';
import { RouteDefinition, SubAppMetadata } from '../types';

export function SubApp(
  metadata: Omit<SubAppMetadata, 'routing'> & {
    routing: Array<RouteDefinition> | Array<Array<RouteDefinition> | RouteDefinition>;
  },
): ClassDecorator {
  return (target) => {
    Reflector.addSubAppMetadata(target, metadata);
  };
}
