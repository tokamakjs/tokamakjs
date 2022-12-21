import React from 'react';
import { Link as _Link, LinkProps as _LinkProps, matchPath } from 'react-router-dom';

import { usePathsContext } from '../../hooks/use-paths-context';

function _trimSearch(href: string): string {
  return href.slice(0, href.indexOf('?'));
}

interface LinkProps extends Omit<_LinkProps, 'to'> {
  href: string;
  noWarn?: boolean;
}

export const Link = ({ href, noWarn = false, ...rest }: LinkProps) => {
  const paths = usePathsContext();

  if (!paths.some((path) => matchPath(path, _trimSearch(href)) != null) && !noWarn) {
    console.warn(`Link href "${href}" does not match any known paths.`);
  }

  return <_Link {...rest} to={href} />;
};
