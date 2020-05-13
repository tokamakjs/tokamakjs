import { observer } from 'mobx-react';

import { RouterState } from '../interfaces';
import { View } from '../types';
import { useMountLifeCycle, useRenderLifeCycle } from './life-cycle-hooks';

interface RouteComponentProps {
  canActivate: (state: RouterState) => boolean;
  routerState: RouterState;
}

export function createRouteComponent(view: View, controller: any) {
  function RouteComponent({ canActivate, routerState }: RouteComponentProps) {
    useMountLifeCycle(controller);
    useRenderLifeCycle(controller);

    if (!canActivate(routerState)) {
      return null;
    }

    return view(controller);
  }

  Object.defineProperty(RouteComponent, 'name', { value: view.name });

  return observer(RouteComponent);
}
