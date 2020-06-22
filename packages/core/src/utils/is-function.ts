export function isFunction(value: any): value is Function {
  return value != null && typeof value === 'function';
}
