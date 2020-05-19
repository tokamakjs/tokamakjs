import React, { Fragment, ReactNode } from 'react';

import { CanActivate, RouterState } from '../interfaces';
import { useLocation, useParams } from './router';

interface HandleGuardsProps {
  guards: Array<CanActivate>;
  children: ReactNode;
}

function _canActivate(state: RouterState, guards: Array<CanActivate>): boolean {
  for (const guard of guards) {
    if (!guard.canActivate(state)) {
      return false;
    }
  }

  return true;
}

export const HandleGuards = ({ guards, children }: HandleGuardsProps) => {
  const state: RouterState = {
    location: useLocation(),
    params: useParams(),
  };

  if (!_canActivate(state, guards)) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};
