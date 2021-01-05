import { WRAPPER_KEY } from '../routing';

export function observable(target: Object, propertyKey: string | symbol): void {
  let valueContainer: any;

  Object.defineProperty(target, propertyKey, {
    configurable: true,
    enumerable: true,
    get() {
      return valueContainer;
    },
    set(value: any) {
      if (value === valueContainer) {
        return;
      }

      valueContainer = value;
      (this as any)[WRAPPER_KEY]?.refresh();
    },
  } as PropertyDescriptor);
}
