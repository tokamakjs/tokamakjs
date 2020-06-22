import { Location } from 'history';
import { ReactNode } from 'react';

import { RouterState } from '../../interfaces';

export type NodeRenderer = (state: RouterState) => ReactNode;

export interface RouteObject {
  caseSensitive?: boolean;
  element: ReactNode | NodeRenderer;
  path: string;
  children?: Array<RouteObject>;
}

export type Params = Record<string, string>;

export interface RouteMatch {
  route: RouteObject;
  pathname: string;
  params: Params;
}

export type RouteBranch = [string, Array<RouteObject>, Array<number>];

export type PathPattern = string | { path: string; caseSensitive?: boolean; end?: boolean };

export interface PathMatch {
  path: string;
  pathname: string;
  params: Params;
}

export type ResolvedLocation = Omit<Location, 'state' | 'key'>;
