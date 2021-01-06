import { Class, DiContainer } from '@tokamakjs/injection';
import React, { ComponentType } from 'react';

import { Reflector } from '../reflection';
import { ControllerWrapper } from './controller-wrapper';
import { useForceUpdate, useMountLifeCycle, useRenderLifeCycle } from './hooks';

export async function createRouteComponent(
  container: DiContainer,
  controller: Class,
): Promise<{ Route: ComponentType; controllerInstance: any }> {
  const { view: useView } = Reflector.getControllerMetadata(controller);

  const controllerInstance = await container.resolve(controller);
  const wrapper = new ControllerWrapper(controllerInstance);

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

    // @ts-ignore
    return <ViewHolder />;
  };

  Route.displayName = `${useView.name.replace('View', '').replace('view', '')}Route`;

  return { Route, controllerInstance };
}
