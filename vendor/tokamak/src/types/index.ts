export * from './type';
export * from './provider';
export * from './injectable';
export * from './module-definition';

export function isFunction(value: any): value is Function {
  return value != null && typeof value === 'function';
}
