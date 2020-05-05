import { observer } from 'mobx-react';
import { ComponentType, createElement } from 'react';
import { ObjectRoute } from 'react-router-dom';

import { AppContext } from '../core';
import { Reflector } from '../reflection';
import { Type, View } from '../types';
import { RouteDefinition } from './utils';

function _createComponent(view: View, controller: any): ComponentType {
  // Since observer() doesn't let us set displayName, we have to create
  // a named function for the component to have the right name in the devtools
  function Component() {
    return view(controller);
  }

  Object.defineProperty(Component, 'name', { value: view.name });

  return Component;
}

function _transformRoutes(
  Module: Type,
  routing: Array<RouteDefinition>,
  context: AppContext,
): Array<ObjectRoute> {
  return routing.map(
    ({ path, controller, children }): ObjectRoute => {
      const { view } = Reflector.getControllerMetadata(controller);

      const instance = context.get(controller);
      const Component = _createComponent(view, instance);

      return {
        path,
        element: createElement(observer(Component)),
        children: _transformRoutes(Module, children, context),
      };
    },
  );
}

export function buildRoutes(Module: Type, context: AppContext): Array<ObjectRoute> {
  const { routing } = Reflector.getModuleMetadata(Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return _transformRoutes(Module, routing, context);
}
