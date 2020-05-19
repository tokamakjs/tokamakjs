import { observer } from 'mobx-react';
import { createElement } from 'react';

import { AppContext } from '../core';
import { Reflector } from '../reflection';
import { Type } from '../types';
import { createCanActivate } from './can-activate';
import { useMountLifeCycle, useRenderLifeCycle, useTrackLoading } from './hooks';
import { useRouterState } from './router';

export function createRouteComponent(context: AppContext, controller: Type<any>) {
  const { view: useView, guards = [], states } = Reflector.getControllerMetadata(controller);

  const instance = context.get(controller);
  const guardInstances = guards.map((guard) => context.get(guard));

  const errorElement = states?.error != null ? createElement(states.error) : undefined;
  const loadingView = states?.loading != null ? createElement(states.loading) : undefined;

  function ViewHolder() {
    const routerState = useRouterState();
    const checkCanActivate = createCanActivate(guardInstances);
    const canActivate = checkCanActivate(routerState);

    useMountLifeCycle(instance, !canActivate);
    useRenderLifeCycle(instance, !canActivate);

    const isLoading = useTrackLoading(instance);

    let defaultView;
    try {
      defaultView = useView(instance);
    } catch (err) {
      if (!isLoading && canActivate) {
        if (errorElement != null) return errorElement;
        throw err;
      }

      if (!canActivate) return null;
      return loadingView ?? null;
    }

    if (!canActivate) return null;
    if (isLoading && loadingView != null) return loadingView;
    return defaultView;
  }

  Object.defineProperty(ViewHolder, 'name', { value: useView.name });

  return observer(ViewHolder);
}
