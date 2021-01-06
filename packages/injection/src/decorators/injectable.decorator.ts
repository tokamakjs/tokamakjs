import { Reflector } from '../reflection';
import { ProviderMetadata } from '../types';

export function Injectable(metadata?: ProviderMetadata): ClassDecorator {
  return (target: Function): void => {
    Reflector.addProviderMetadata(target, metadata);
  };
}
