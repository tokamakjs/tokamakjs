import { Class } from '@tokamakjs/injection';
import React from 'react';

import { useDiContainer } from '../../hooks/use-di-container';
import { useGlobalErrorsManager } from '../../hooks/use-global-errors-manager';
import { Reflector } from '../../reflection';
import { ControllerWrapper } from './ControllerWrapper';
import { ErrorBoundary } from './ErrorBoundary';
import { Guards } from './Guards';

interface RouteWrapperProps<T> {
  Controller: Class<T>;
}

export const RouteWrapper = <T extends any>({ Controller }: RouteWrapperProps<T>) => {
  const container = useDiContainer();
  const globalErrorsManager = useGlobalErrorsManager();

  const { guards = [], handlers = [] } = Reflector.getControllerMetadata(Controller);

  const eh = handlers.map((v) => (typeof v === 'function' ? container.resolveDepsSync(v) : v));
  const gs = guards.map((G) => container.resolveSync(G));

  return (
    <ErrorBoundary name={Controller.name} globalErrorsManager={globalErrorsManager} handlers={eh}>
      <Guards guards={gs}>
        <ControllerWrapper Controller={Controller} />
      </Guards>
    </ErrorBoundary>
  );
};
