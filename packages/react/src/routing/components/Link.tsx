import React, { forwardRef } from 'react';
import { Link as _Link, LinkProps as _LinkProps, matchPath } from 'react-router-dom';

import { usePathsContext } from '../../hooks/use-paths-context';

function _trimSearch(href: string): string {
  if (href.indexOf('?') < 0) return href;
  return href.slice(0, href.indexOf('?'));
}

interface LinkProps extends Omit<_LinkProps, 'to'> {
  href: string;
  noWarn?: boolean;
}

export const Link = forwardRef(
  ({ href, noWarn = false, ...rest }: LinkProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
    const paths = usePathsContext();

    if (!paths.some((path) => matchPath(path, _trimSearch(href)) != null) && !noWarn) {
      console.warn(`Link href "${href}" does not match any known paths.`);
    }

    return <_Link {...rest} to={href} ref={ref} />;
  },
);
