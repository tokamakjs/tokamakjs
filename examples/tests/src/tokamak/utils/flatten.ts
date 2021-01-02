import { transform } from 'lodash';

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export function flatten<T>(arr: RecursiveArray<T>): Array<T> {
  return arr.reduce((memo, item) => {
    if (Array.isArray(item)) {
      const flat = flatten(item);
      return [...memo, ...flat];
    }

    return [...memo, item];
  }, [] as any);
}

export function flattenTree<T, K extends keyof T>(tree: T, key: K): Array<T> {
  const value = tree[key];

  if (Array.isArray(value)) {
    return [tree, ...value.reduce((memo, x) => [...memo, ...flattenTree(x, key)], [])];
  }

  return [tree];
}
