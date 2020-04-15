import join from 'url-join';

import { ModuleMetadataKey } from '../decorators';
import { Constructor } from '../types';

export interface RouteDefinition {
  path: string;
  Route: Constructor;
  children: Array<RouteDefinition>;
}

function _isArrayOfArrays(value: Array<any>): value is Array<Array<RouteDefinition>> {
  return value.length > 0 && Array.isArray(value[0]);
}

export function createRoute(
  path: string,
  Route: Constructor,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>> = [],
): RouteDefinition {
  if (_isArrayOfArrays(children)) {
    return { path, Route, children: children.flat() };
  }

  return { path, Route, children };
}

export function includeRoutes(basepath: string, Module: Constructor): Array<RouteDefinition> {
  const routing: Array<RouteDefinition> = Reflect.getMetadata(ModuleMetadataKey.ROUTING, Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return routing.map((route) => {
    return { ...route, path: join(basepath, route.path) };
  });
}
