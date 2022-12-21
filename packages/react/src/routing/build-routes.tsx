import { Class, DiContainer } from '@tokamakjs/injection';
import React from 'react';
import { RouteObject } from 'react-router';

import { Reflector } from '../reflection';
import { RouteDefinition } from '../types';
import { RouteWrapper } from './components/RouteWrapper';

function _getId(): number {
  return Math.random();
}

function _transformRoutes(
  routing: Array<RouteDefinition>,
  context: DiContainer,
): Array<RouteObject> {
  const finalRoutes: Array<RouteObject> = [];

  for (const routeDefinition of routing) {
    const { path, Controller, children } = routeDefinition;

    finalRoutes.push({
      path,
      // each controller needs a unique key so they're correctly mounted/unmounted
      element: <RouteWrapper Controller={Controller} key={_getId()} />,
      children: _transformRoutes(children, context),
      caseSensitive: false,
    });
  }

  return finalRoutes;
}

export function buildRoutes(RootApp: Class, container: DiContainer): Array<RouteObject> {
  const { routing } = Reflector.getSubAppMetadata(RootApp);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return _transformRoutes(routing, container);
}
