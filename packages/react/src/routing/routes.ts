import { Class, inject, isClass } from '@tokamakjs/injection';
import { History } from 'history';
import urljoin from 'url-join';

import { Controller, onDidMount } from '../decorators';
import { Reflector } from '../reflection';
import { RouteDefinition, RouteHandler, View } from '../types';
import { HISTORY } from './constants';

function _isArrayOfArrays<T>(value: Array<any>): value is Array<Array<T>> {
  return value.length > 0 && Array.isArray(value[0]);
}

function _getControllerName(view: View): string {
  let name = view.name;

  if (name == null || name === '') {
    return 'EmptyController';
  }

  if (name.includes('View')) {
    name = name.replace('View', '');
  }

  return `${name[0].toUpperCase()}${name.slice(1)}Controller`;
}

function _createEmptyController(view: View): Class {
  @Controller({ view })
  class EmptyController {}

  Object.defineProperty(EmptyController, 'name', { value: _getControllerName(view) });

  return EmptyController;
}

export function createRoute(
  path: string,
  handler: RouteHandler,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>> = [],
): RouteDefinition {
  const controller = isClass(handler) ? handler : _createEmptyController(handler);
  return _isArrayOfArrays(children)
    ? { path, controller, children: children.flat() }
    : { path, controller, children };
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

  return { path: from, controller: RedirectionController, children: [] };
}
