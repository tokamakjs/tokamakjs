import join from 'url-join';

import { Reflector } from '../reflection';
import { Type } from '../types';

export interface RouteDefinition {
  path: string;
  Route: Function;
  children: Array<RouteDefinition>;
}

function _isArrayOfArrays<T>(value: Array<any>): value is Array<Array<T>> {
  return value.length > 0 && Array.isArray(value[0]);
}

export function createRoute(
  path: string,
  Route: Type,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>> = [],
): RouteDefinition {
  if (_isArrayOfArrays(children)) {
    return { path, Route, children: children.flat() };
  }

  return { path, Route, children };
}

export function includeRoutes(basepath: string, Module: Function): Array<RouteDefinition> {
  const { routing } = Reflector.getModuleMetadata(Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return routing.map((route) => {
    return { ...route, path: join(basepath, route.path) };
  });
}
