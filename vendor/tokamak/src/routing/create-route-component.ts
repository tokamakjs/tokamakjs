import { observer } from 'mobx-react';
import { createElement } from 'react';

import { RouterState } from '../interfaces';
import { View } from '../types';
import { useMountLifeCycle, useRenderLifeCycle, useTrackLoading } from './hooks';

interface RouteComponentProps {
  canActivate: (state: RouterState) => boolean;
  routerState: RouterState;
}

export function createRouteComponent(view: View, controller: any, loadingView?: View) {
  function RouteComponent({ canActivate, routerState }: RouteComponentProps) {
    useMountLifeCycle(controller);
    useRenderLifeCycle(controller);
    const isLoading = useTrackLoading(controller);

    // TODO: Move to a <CanActivate> component since this should happen
    // before the lifecycle hooks have been called.
    if (!canActivate(routerState)) {
      return null;
    }

    if (loadingView != null && isLoading) {
      return createElement(() => loadingView());
    }

    return createElement(() => view(controller));
  }

  Object.defineProperty(RouteComponent, 'name', { value: view.name });

  return observer(RouteComponent);
}
