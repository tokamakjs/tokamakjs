import { addHook } from '../utils/hooks';

export function onModuleInit(): MethodDecorator {
  return (target, propertyKey) => {
    addHook(target, 'onModuleInit', (target as any)[propertyKey]);
  };
}

export function onModuleDidInit(): MethodDecorator {
  return (target, propertyKey) => {
    addHook(target, 'onModuleDidInit', (target as any)[propertyKey]);
  };
}
