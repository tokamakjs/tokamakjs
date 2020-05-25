export * from './type';
export * from './provider';
export * from './injectable';
export * from './module-definition';
export * from './view';
export * from './controller';

export function isFunction(value: any): value is Function {
  return value != null && typeof value === 'function';
}
