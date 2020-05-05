import join from 'url-join';

import { controller } from '../decorators';
import { Reflector } from '../reflection';
import { Type, View } from '../types';

export interface RouteDefinition {
  path: string;
  controller: Type;
  children: Array<RouteDefinition>;
}

function _isArrayOfArrays<T>(value: Array<any>): value is Array<Array<T>> {
  return value.length > 0 && Array.isArray(value[0]);
}

function _genControllerName(view: View): string {
  let name = view.name;
  if (name.includes('View')) {
    name = name.replace('View', '');
  }
  return `${name[0].toUpperCase()}${name.slice(1)}`;
}

function _createFakeController(view: View): Type {
  @controller({ view })
  class Controller {}

  Object.defineProperty(Controller, 'name', { value: _genControllerName(view) });

  return Controller;
}

export function createRoute(
  path: string,
  controllerOrView: Type | View,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>> = [],
): RouteDefinition {
  const controller = Reflector.isController(controllerOrView)
    ? controllerOrView
    : _createFakeController(controllerOrView);

  if (_isArrayOfArrays(children)) {
    return { path, controller, children: children.flat() };
  }

  return { path, controller, children };
}

export function includeRoutes(basepath: string, Module: Type): Array<RouteDefinition> {
  const { routing } = Reflector.getModuleMetadata(Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return routing.map((route) => {
    return { ...route, path: join(basepath, route.path) };
  });
}
