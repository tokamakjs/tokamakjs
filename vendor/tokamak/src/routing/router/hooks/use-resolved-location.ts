import { To, parsePath } from 'history';
import { useContext, useMemo } from 'react';
import join from 'url-join';

import { RouteContext } from '../route-context';
import { ResolvedLocation } from '../types';

function _resolvePathname(toPathname: string, fromPathname: string): string {
  const segments = fromPathname.replace(/\/+$/, '').split('/');
  const relativeSegments = toPathname.split('/');

  relativeSegments.forEach((segment) => {
    if (segment === '..') {
      if (segments.length > 1) segments.pop();
    } else if (segment !== '.') {
      segments.push(segment);
    }
  });

  return segments.length > 1 ? join(...segments) : '/';
}

function _resolveLocation(to: To, fromPathname = '/'): ResolvedLocation {
  const { pathname: toPathname, search = '', hash = '' } =
    typeof to === 'string' ? parsePath(to) : to;
  const pathname =
    toPathname != null
      ? _resolvePathname(toPathname, toPathname.startsWith('/') ? '/' : fromPathname)
      : fromPathname;
  return { pathname, search, hash };
}

export function useResolvedLocation(to: To): ResolvedLocation {
  const { pathname } = useContext(RouteContext);
  return useMemo(() => _resolveLocation(to, pathname), [to, pathname]);
}
