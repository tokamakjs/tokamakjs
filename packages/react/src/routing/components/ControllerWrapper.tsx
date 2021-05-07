import { Guard } from '@tokamakjs/common';
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

  const errorHandlers = handlers.map((v) => {
    return typeof v === 'function' ? container.resolveDependenciesSync(v) : v;
  });

  const guardsInstances = guards.map((G) => container.resolveSync<Guard>(G));

  return (
    <ErrorBoundary globalErrorsManager={globalErrorsManager} handlers={errorHandlers}>
      <ControllerContext.Provider value={ctrl}>
        <Guards guards={guardsInstances}>
          <View />
        </Guards>
      </ControllerContext.Provider>
    </ErrorBoundary>
  );
};
