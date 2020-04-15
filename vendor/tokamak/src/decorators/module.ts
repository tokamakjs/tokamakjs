import { Constructor } from '../types';

export function Module<T>(args: any) {
  return (target: Constructor<T>) => {
    console.log(target);
  };
}
