import { Dispatch, SetStateAction, useState } from 'react';
import { ZodError, z } from 'zod';

type NoUndefinedState<T> = T extends [
  infer S | undefined,
  Dispatch<SetStateAction<infer S | undefined>>,
]
  ? [S, Dispatch<SetStateAction<S>>]
  : never;

type UseStateTuple<T> = NoUndefinedState<ReturnType<typeof useState<T>>>;

interface UseFormOptions<V> {
  defaults: Partial<V>;
  autoValidate: boolean;
}

type ErrorsFor<T extends Record<string, any>> = Partial<{
  [key in keyof T]: string | Array<string>;
}>;

class ManagedForm<T extends Zod.Schema, V extends z.infer<T>, E extends ErrorsFor<V>> {
  private get _state() {
    return this._stateTuple[0];
  }

  private get _setState() {
    return this._stateTuple[1];
  }

  private get _errors() {
    return this._errorsTuple[0];
  }

  private get _setErrors() {
    return this._errorsTuple[1];
  }

  public get errors() {
    return {
      get: <K extends keyof V>(key: K): E[K] | undefined => {
        return this._errors[key];
      },
      set: <K extends keyof V>(key: K, value: undefined | string | Array<string>): void => {
        this._setErrors((errors) => {
          return { ...errors, [key]: value };
        });
      },
      clear: (): void => {
        return this._setErrors({} as E);
      },
      all: (): E => {
        return this._errors;
      },
    };
  }

  constructor(
    private readonly _schema: T,
    private readonly _defaults: Partial<V>,
    private readonly _autoValidate: boolean,
    private readonly _stateTuple: UseStateTuple<Partial<V>>,
    private readonly _errorsTuple: UseStateTuple<E>,
  ) {}

  /**
   * Arrow functions are used in these methods to ensure
   * that "this" is not accidentally reassigned. This is
   * particularly important when these methods are directly
   * passed down for calling, such as in the case
   * of <Input onChange={form.set} />.
   */
  public readonly validate = (): V | undefined => {
    try {
      return this._schema.parse(this._state) as V;
    } catch (e) {
      if (e instanceof ZodError) {
        this._setErrors(e.formErrors.fieldErrors as E);
        return undefined;
      }

      throw e;
    }
  };

  public readonly reset = (): void => {
    this.errors.clear();
    this._setState(() => this._defaults);
  };

  public readonly clear = (): void => {
    this._setState({});
  };

  public readonly get = <K extends keyof V>(key: K): V[K] | string => {
    if (key == null) {
      throw new Error('Undefined `name`. Please, make sure every Input has a `name` field.');
    }

    return this._state[key] ?? '';
  };

  public readonly set = <K extends keyof V>(key: K, value: V[K]): void => {
    if (key == null) {
      throw new Error('Undefined `name`. Please, make sure every Input has a `name` field.');
    }

    this._setState((state) => {
      const newState = { ...state, [key]: value };

      if (this._autoValidate) {
        this.check(key);
      }

      return newState;
    });
  };

  public readonly check = <K extends keyof V>(key: K): boolean => {
    try {
      this._schema.parse(this._state);
      return true;
    } catch (e) {
      if (e instanceof ZodError) {
        const fieldErrors = e.formErrors.fieldErrors[key];
        this.errors.set(key, fieldErrors);
        return false;
      } else {
        throw e;
      }
    }
  };
}

export function useForm<T extends Zod.Schema, V extends z.infer<T>, E extends ErrorsFor<V>>(
  schema: T,
  { defaults = {}, autoValidate }: UseFormOptions<V>,
): ManagedForm<T, V, E> {
  const state = useState(defaults);
  const errors = useState<E>({} as E);

  return new ManagedForm(schema, defaults, autoValidate, state, errors);
}
