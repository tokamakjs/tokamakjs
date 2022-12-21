import { useContext } from 'react';

import { ControllerContext } from '../routing/components/ControllerWrapper';

export function useController<T>(): T {
  const ctrl = useContext<T>(ControllerContext);

  if (ctrl == null) {
    throw new Error('Controller not found.');
  }

  return ctrl;
}
