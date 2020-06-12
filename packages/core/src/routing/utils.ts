import join from 'url-join';

import { View, controller } from '../decorators';
import { Reflector } from '../reflection';
import { Type } from '../utils';

export interface RouteDefinition {
  path: string;
  controller: Type;
  children: Array<RouteDefinition>;
  isIncluded: boolean;
}

function _isArrayOfArrays<T>(value: Array<any>): value is Array<Array<T>> {
  return value.length > 0 && Array.isArray(value[0]);
}

function _genControllerName(view: View): string {
  let name = view.name;
  if (name.includes('View')) {
    name = name.replace('View', '');
  }
  return `${name[0].toUpperCase()}${name.slice(1)}Controller`;
}

function _createEmptyController(view: View): Type {
  @controller({ view })
  class EmptyController {}

  Object.defineProperty(EmptyController, 'name', { value: _genControllerName(view) });

  return EmptyController;
}

export function createRoute(
  path: string,
  controllerOrView: Type | View,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>> = [],
): RouteDefinition {
  const controller = Reflector.isController(controllerOrView)
    ? controllerOrView
    : _createEmptyController(controllerOrView);

  if (_isArrayOfArrays(children)) {
    return { path, controller, children: children.flat(), isIncluded: false };
  }

  return { path, controller, children, isIncluded: false };
}

export function includeRoutes(basepath: string, Module: Type): Array<RouteDefinition> {
  const { routing } = Reflector.getModuleMetadata(Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return routing.map((route) => {
    return { ...route, path: join(basepath, route.path), isIncluded: true };
  });
}
