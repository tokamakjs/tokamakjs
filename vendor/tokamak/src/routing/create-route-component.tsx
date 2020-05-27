import React, { Fragment, createElement } from 'react';

import { useForceUpdate, usePromise } from '../common';
import { AppContext } from '../core';
import { Reflector } from '../reflection';
import { ControllerWrapper, Type } from '../types';
import { createCanActivate } from './can-activate';
import { useMountLifeCycle, useRenderLifeCycle, useTrackLoading } from './hooks';
import { useRouterState } from './router';

export function createRouteComponent(context: AppContext, controller: Type<any>) {
  const { view: useView, guards = [], states } = Reflector.getControllerMetadata(controller);

  const controllerInstance = context.get(controller);
  const guardInstances = guards.map((guard) => context.get(guard));
  const wrapper = new ControllerWrapper(controllerInstance);

  const errorElement = states?.error != null ? createElement(states.error) : undefined;
  const loadingView = states?.loading != null ? createElement(states.loading) : undefined;

  function ViewHolder() {
    useMountLifeCycle(controllerInstance);
    useRenderLifeCycle(controllerInstance);
    return useView(controllerInstance);
  }

  Object.defineProperty(ViewHolder, 'name', { value: useView.name });

  wrapper.setViewHolder(ViewHolder);

  function Route() {
    const forceUpdate = useForceUpdate();
    wrapper.setRefreshFunction(forceUpdate);

    const [render, isPending, result] = usePromise(wrapper.render.bind(wrapper));

    if (wrapper.needsRefresh) {
      render();
    }

    if (isPending || result == null || wrapper.needsRefresh) {
      return <Fragment>Loading...</Fragment>;
    }

    return result as any;
  }

  return Route;
}
