import { useContext } from 'react';

import { RouteContext } from '../route-context';

export const Outlet = () => {
  const { outlet } = useContext(RouteContext);
  return outlet;
};
