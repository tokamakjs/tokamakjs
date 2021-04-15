import { Class, inject } from '@tokamakjs/injection';
import { History } from 'history';
import urljoin from 'url-join';

import { Controller, onDidMount } from '../decorators';
import { useController } from '../hooks';
import { Reflector } from '../reflection';
import { RouteDefinition, RouteHandler } from '../types';
import { HISTORY } from './constants';

function _isArrayOfArrays<T>(value: Array<any>): value is Array<Array<T>> {
  return value.length > 0 && Array.isArray(value[0]);
}

export function createRoute(
  path: string,
  Component: RouteHandler,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>> = [],
): RouteDefinition {
  return _isArrayOfArrays(children)
    ? { path, Component, children: children.flat() }
    : { path, Component, children };
}

export function includeRoutes(basepath: string, SubApp: Class): Array<RouteDefinition> {
  const { routing } = Reflector.getSubAppMetadata(SubApp);
  return routing.map((route) => ({ ...route, path: urljoin(basepath, route.path) }));
}

export function createRedirection(from: string, to: string): RouteDefinition {
  @Controller({ view: () => null })
  class RedirectionController {
    constructor(@inject(HISTORY) private readonly _history: History) {}

    @onDidMount()
    onDidMount() {
      this._history.replace(to);
    }
  }

  const RedirectionView = () => {
    useController(RedirectionController);
    return null;
  };

  return { path: from, Component: RedirectionView, children: [] };
}
