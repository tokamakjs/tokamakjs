import { Reflector } from '../reflection';
import { SubAppMetadata } from '../types';

export function SubApp(metadata: SubAppMetadata): ClassDecorator {
  return (target) => {
    Reflector.addSubAppMetadata(target, metadata);
  };
}
