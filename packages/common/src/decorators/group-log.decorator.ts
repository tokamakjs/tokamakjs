export function groupLog(label: string): MethodDecorator {
  return (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void => {
    const original = Reflect.get(target, key) as Function;

    descriptor.value = function (...args: Array<any>) {
      console.group(label);
      const result = original.apply(this, ...args);
      console.groupEnd();
      return result;
    };
  };
}
