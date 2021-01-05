import join from 'url-join';

import { RouteBranch, RouteObject } from '../types';

export function flattenRoutes(
  routes: Array<RouteObject>,
  branches: Array<RouteBranch> = [],
  parentPath = '',
  parentRoutes: Array<RouteObject> = [],
  parentIndexes: Array<number> = [],
): Array<RouteBranch> {
  routes.forEach((route, i) => {
    const path = join(parentPath, route.path);
    const routes = [...parentRoutes, route];
    const indexes = [...parentIndexes, i];

    if (route.children != null) {
      flattenRoutes(route.children, branches, path, routes, indexes);
    }

    branches.push([path, routes, indexes]);
  });

  return branches;
}
