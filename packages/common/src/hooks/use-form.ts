import { useState } from 'react';

export interface ManagedForm<T> {
  get: (name?: keyof T) => T[keyof T] | '';
  set: (value: T[keyof T], name?: keyof T) => void;
  values: Partial<T>;
  reset: () => void;
}

export function useForm<T extends object = Record<string, any>>(
  defaultValues: Partial<T> = {},
): ManagedForm<T> {
  const [state, setState] = useState<Partial<T>>(defaultValues);

  const getter = <K extends keyof T>(name?: K): T[K] | '' => {
    if (name == null) {
      throw new Error(
        'Undefined `name` prop found in component. Please, make sure every Input has a `name` field.',
      );
    }

    return state[name] ?? '';
  };

  const setter = (value: T[keyof T], name?: keyof T): void => {
    if (name == null) {
      throw new Error(
        'Undefined `name` prop found in component. Please, make sure every Input has a `name` field.',
      );
    }

    setState((state) => {
      return { ...state, [name]: value };
    });
  };

  const resetter = () => {
    setState(defaultValues);
  };

  return { set: setter, get: getter, values: state, reset: resetter };
}
