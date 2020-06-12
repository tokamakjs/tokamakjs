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
