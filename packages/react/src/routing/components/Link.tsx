import React from 'react';
import { Link as _Link, LinkProps as _LinkProps, matchPath } from 'react-router-dom';

import { usePathsContext } from '../../hooks';

interface LinkProps extends Omit<_LinkProps, 'to'> {
  href: string;
  noWarn?: boolean;
}

export const Link = ({ href, noWarn = false, ...rest }: LinkProps) => {
  const paths = usePathsContext();

  if (!paths.some((path) => matchPath(path, href) != null) && !noWarn) {
    console.warn(`Link href "${href}" does not match any known paths.`);
  }

  return <_Link {...rest} to={href} />;
};
