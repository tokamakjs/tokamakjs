import { Constructor } from '../types';

export interface RouteDefinition {
  path: string;
  Route: Constructor;
  children: Array<RouteDefinition>;
}

export function includeRoutes(...args: any): any {
  console.log(args);
}

export function createRoute(
  path: string,
  Route: Constructor,
  children: Array<RouteDefinition> = [],
): RouteDefinition {
  return { path, Route, children };
}
