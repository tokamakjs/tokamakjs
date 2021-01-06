import { addHook } from '@tokamakjs/injection';

export function onDidMount(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    addHook(target, 'onDidMount', (target as any)[propertyKey]);
  };
}

export function onWillUnmount(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    addHook(target, 'onWillUnmount', (target as any)[propertyKey]);
  };
}

export function onDidRender(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    addHook(target, 'onDidRender', (target as any)[propertyKey]);
  };
}
