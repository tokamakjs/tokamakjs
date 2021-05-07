import { GlobalErrorsManager } from '@tokamakjs/common';
import { useContext } from 'react';

import { ErrorsContext } from '../tokamak-app';

export function useGlobalErrorsManager(): GlobalErrorsManager {
  const globalErrorsHandler = useContext(ErrorsContext);

  if (globalErrorsHandler == null) {
    throw new Error('No global errors handler found in the context.');
  }

  return globalErrorsHandler;
}
