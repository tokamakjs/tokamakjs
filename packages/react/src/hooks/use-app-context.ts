import { useContext } from 'react';

import { AppContext } from '../tokamak-app';

export function useAppContext<T = unknown>(): T {
  return useContext(AppContext) as T;
}
