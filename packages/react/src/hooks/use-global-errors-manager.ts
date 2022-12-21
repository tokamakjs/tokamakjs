import { GlobalErrorsManager } from '@tokamakjs/common';
import { createContext, useContext } from 'react';

export const ErrorsContext = createContext<GlobalErrorsManager | undefined>(undefined);

export function useGlobalErrorsManager(): GlobalErrorsManager {
  const globalErrorsHandler = useContext(ErrorsContext);

  if (globalErrorsHandler == null) {
    throw new Error('No global errors handler found in the context.');
  }

  return globalErrorsHandler;
}
