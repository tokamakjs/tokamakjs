import React from 'react';

import { useForceUpdate } from '../common';
import { AppContext } from '../core';
import { Reflector } from '../reflection';
import { Type } from '../types';
import { ControllerWrapper } from './controller-wrapper';
import { useMountLifeCycle, useRenderLifeCycle } from './hooks';

export function createRouteComponent(context: AppContext, controller: Type<any>) {
  const { view: useView, guards = [], states } = Reflector.getControllerMetadata(controller);

  const controllerInstance = context.get(controller);
  const guardInstances = guards.map((guard) => context.get(guard));
  const wrapper = new ControllerWrapper(controllerInstance, guardInstances);

  // const errorElement = states?.error != null ? createElement(states.error) : null;
  // const loadingView = states?.loading != null ? createElement(states.loading) : null;

  const ViewHolder = () => {
    useMountLifeCycle(controllerInstance);
    useRenderLifeCycle(controllerInstance);
    return useView(controllerInstance);
  };

  ViewHolder.displayName = useView.name;

  const Route = () => {
    useMountLifeCycle(wrapper);

    const forceUpdate = useForceUpdate();
    wrapper.setRefreshFunction(forceUpdate);

    return <ViewHolder />;
  };

  Route.displayName = `${useView.name.replace('View', '').replace('view', '')}Route`;

  return Route;
}
