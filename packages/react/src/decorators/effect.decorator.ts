import { Reflector } from '../reflection';
import { DepsFn } from '../types';

export function effect(deps?: DepsFn): MethodDecorator {
  return (target, propertyKey) => {
    Reflector.setInEffectKeysMap(target, propertyKey, deps);
  };
}

export function onDidMount(): MethodDecorator {
  return effect(() => []);
}

export function onDidRender(): MethodDecorator {
  return effect();
}
