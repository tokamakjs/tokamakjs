import React, { Fragment, createElement } from 'react';

import { useForceUpdate, usePromise } from '../common';
import { AppContext } from '../core';
import { Reflector } from '../reflection';
import { ControllerWrapper, Type } from '../types';
import { useMountLifeCycle, useRenderLifeCycle } from './hooks';

export function createRouteComponent(context: AppContext, controller: Type<any>) {
  const { view: useView, guards = [], states } = Reflector.getControllerMetadata(controller);

  const controllerInstance = context.get(controller);
  const guardInstances = guards.map((guard) => context.get(guard));
  const wrapper = new ControllerWrapper(controllerInstance, guardInstances);

  const errorElement = states?.error != null ? createElement(states.error) : null;
  const loadingView = states?.loading != null ? createElement(states.loading) : null;

  const ViewHolder = () => {
    useMountLifeCycle(controllerInstance);
    useRenderLifeCycle(controllerInstance);
    return useView(controllerInstance);
  };

  ViewHolder.displayName = useView.name;

  wrapper.setViewHolder(ViewHolder);

  const Route = () => {
    const forceUpdate = useForceUpdate();
    wrapper.setRefreshFunction(forceUpdate);

    const [triggerRender, isPending, result] = usePromise(wrapper.render.bind(wrapper));
    if (wrapper.shouldRefresh) triggerRender();

    if (isPending || result == null || wrapper.shouldRefresh) {
      return <Fragment>{loadingView}</Fragment>;
    }

    return result as any;
  };

  Route.displayName = `${useView.name.replace('View', '').replace('view', '')}Route`;

  return Route;
}
