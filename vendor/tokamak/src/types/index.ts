export * from './Type';
export * from './Route';
export * from './Token';
export * from './Provider';
export * from './GraphNode';
export * from './Injectable';

export function isFunction(value: any): value is Function {
  return value != null && typeof value === 'function';
}
