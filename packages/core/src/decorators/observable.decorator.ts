import { WRAPPER_KEY } from '../routing';

export function observable(target: Object, propertyKey: string | symbol): void {
  const propertyContainer = {} as any;

  Object.defineProperty(target, propertyKey, {
    configurable: true,
    enumerable: true,
    get() {
      return propertyContainer[propertyKey];
    },
    set(value: any) {
      if (value === propertyContainer[propertyKey]) {
        return;
      }

      propertyContainer[propertyKey] = value;
      (this as any)[WRAPPER_KEY]?.refresh();
    },
  } as PropertyDescriptor);
}
