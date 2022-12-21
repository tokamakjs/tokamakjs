import { createContext, useContext } from 'react';

export const AppContext = createContext<unknown>({});

export function useAppContext<T = unknown>(): T {
  return useContext(AppContext) as T;
}
