import React, { ComponentType, Fragment, createElement } from 'react';

import { AppContext } from '../injection';
import { Reflector } from '../reflection';
import { Constructor } from '../utils';
import { ControllerWrapper } from './controller-wrapper';
import { useForceUpdate, useGuards, useMountLifeCycle, useRenderLifeCycle } from './hooks';

export function createRouteComponent(
  context: AppContext,
  controller: Constructor,
): { Route: ComponentType; controllerInstance: any } {
  const { view: useView, guards = [], states } = Reflector.getControllerMetadata(controller);

  const controllerInstance = context.get(controller);
  const guardInstances = guards.map((guard) => context.get(guard));
  const wrapper = new ControllerWrapper(controllerInstance);

  // const errorElement = states?.error != null ? createElement(states.error) : null;
  const loadingView = states?.loading != null ? createElement(states.loading) : null;

  const ViewHolder = () => {
    const forceUpdate = useForceUpdate();
    wrapper.setRefreshViewFunction(forceUpdate);

    useMountLifeCycle(controllerInstance);
    useRenderLifeCycle(controllerInstance);
    return useView(controllerInstance);
  };

  ViewHolder.displayName = useView.name;

  const Route = () => {
    useMountLifeCycle(wrapper);
    const { isPending, forbidden } = useGuards(guardInstances);

    if (isPending) {
      return <Fragment>{loadingView}</Fragment>;
    }

    if (forbidden) {
      return null;
    }

    return <ViewHolder />;
  };

  Route.displayName = `${useView.name.replace('View', '').replace('view', '')}Route`;

  return { Route, controllerInstance };
}
