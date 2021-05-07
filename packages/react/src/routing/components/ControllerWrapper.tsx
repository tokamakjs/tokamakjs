import { Class } from '@tokamakjs/injection';
import React, { createContext } from 'react';

import { useDiContainer, useGlobalErrorsManager, useResolveController } from '../../hooks';
import { DecoratedController } from '../../types';
import { ErrorBoundary } from './ErrorBoundary';
import { Guards } from './Guards';

export const ControllerContext = createContext<DecoratedController | undefined>(undefined);

interface ControllerWrapperProps<T> {
  Controller: Class<T>;
}

export const ControllerWrapper = <T extends any>({ Controller }: ControllerWrapperProps<T>) => {
  const ctrl = useResolveController(Controller);
  const container = useDiContainer();
  const globalErrorsManager = useGlobalErrorsManager();

  const { view: View, guards = [], handlers = [] } = ctrl.__controller__;

  const eh = handlers.map((v) => (typeof v === 'function' ? container.resolveDepsSync(v) : v));
  const gs = guards.map((G) => container.resolveSync(G));

  return (
    <ControllerContext.Provider value={ctrl}>
      <ErrorBoundary name={Controller.name} globalErrorsManager={globalErrorsManager} handlers={eh}>
        <Guards guards={gs}>
          <View />
        </Guards>
      </ErrorBoundary>
    </ControllerContext.Provider>
  );
};
