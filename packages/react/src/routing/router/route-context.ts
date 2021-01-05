import { ReactElement, createContext } from 'react';

import { Params, RouteObject } from './types';

export const RouteContext = createContext<{
  outlet: ReactElement | null;
  params: Params;
  pathname: string;
  route?: RouteObject;
}>({
  outlet: null,
  params: {},
  pathname: '',
  route: undefined,
});
