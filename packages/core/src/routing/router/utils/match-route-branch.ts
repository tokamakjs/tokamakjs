import join from 'url-join';

import { Params, RouteBranch, RouteMatch } from '../types';
import { matchPath } from './match-path';

export function matchRouteBranch(
  branch: RouteBranch,
  pathname: string,
): Array<RouteMatch> | undefined {
  const [, routes] = branch;
  let matchedPathname = '/';
  let matchedParams = {} as Params;

  let matches: Array<RouteMatch> = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const { path, caseSensitive } = route;
    const remainingPathname =
      matchedPathname === '/' ? pathname : pathname.slice(matchedPathname.length) ?? '/';
    const routeMatch = matchPath(
      { path, caseSensitive, end: i === routes.length - 1 },
      remainingPathname,
    );

    if (routeMatch == null) {
      return;
    }

    matchedPathname = join(matchedPathname, routeMatch.pathname);
    matchedParams = { ...matchedParams, ...routeMatch.params };

    matches.push({ route, pathname: matchedPathname, params: matchedParams });
  }

  return matches;
}
