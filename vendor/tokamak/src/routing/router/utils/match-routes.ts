import { LocationPieces, Path, parsePath } from 'history';

import { RouteMatch, RouteObject } from '../types';
import { flattenRoutes } from './flatten-routes';
import { matchRouteBranch } from './match-route-branch';
import { rankRouteBranches } from './rank-route-branches';

export function matchRoutes(
  routes: Array<RouteObject>,
  location: Path | LocationPieces,
  basename?: string,
): Array<RouteMatch> | undefined {
  if (typeof location === 'string') {
    location = parsePath(location);
  }

  let { pathname = '/' } = location;

  if (basename != null) {
    const base = basename.replace(/^\/*/, '/').replace(/\/+$/, '');
    if (pathname.startsWith(base)) {
      pathname = pathname === base ? '/' : pathname.slice(base.length);
    } else {
      return; // no match
    }
  }

  const branches = rankRouteBranches(flattenRoutes(routes));

  let matches;
  while (branches.length > 0) {
    matches = matchRouteBranch(branches.shift()!, pathname);

    if (matches != null) {
      break;
    }
  }

  return matches;
}
