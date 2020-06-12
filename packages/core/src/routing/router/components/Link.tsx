import { LocationPieces, State, createPath } from 'history';
import React, { AnchorHTMLAttributes, MouseEvent, forwardRef } from 'react';

import { useLocation } from '../hooks';
import { useHistory } from '../hooks/use-history';
import { useResolvedLocation } from '../hooks/use-resolved-location';

function _locationPathsAreSame(a: LocationPieces, b: LocationPieces) {
  return createPath(a) === createPath(b);
}

function _isModifiedEvent(event: MouseEvent): boolean {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  replace?: boolean;
  state?: State;
  href: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, onClick, target, replace: replaceProp = false, state, ...rest }, ref) => {
    const history = useHistory();
    const location = useLocation();

    const toLocation = useResolvedLocation(href);
    const fullHref = history.createHref(toLocation);

    const handleOnClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (onClick != null) {
        onClick(e);
      }

      if (
        !e.defaultPrevented &&
        e.button === 0 &&
        (target == null || target === '_self') &&
        !_isModifiedEvent(e)
      ) {
        e.preventDefault();
        const replace = replaceProp != null || _locationPathsAreSame(location, toLocation);
        replace ? history.replace(toLocation, state) : history.push(toLocation, state);
      }
    };

    return <a {...rest} onClick={handleOnClick} href={fullHref} ref={ref} />;
  },
);
