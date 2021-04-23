import { Reflector } from '../reflection';
import { ProviderMetadata } from '../types';

export function Injectable(metadata?: ProviderMetadata): ClassDecorator {
  return (Target: Function): void => {
    Reflector.addProviderMetadata(Target, metadata);
  };
}

Injectable.getDependencies = (
  input: Function,
): ReturnType<typeof Reflector['getConstructorDependencies']> => {
  return Reflector.getConstructorDependencies(input);
};
