import { Reflector } from '../reflection';

export function inject<T = any>(token: T): ParameterDecorator {
  return (target: Object, _: string | symbol, index: number): void => {
    Reflector.addManuallyInjectedDeps(target, [{ index, token }]);
  };
}
