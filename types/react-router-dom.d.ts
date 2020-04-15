declare module 'react-router-dom' {
  import { ReactNode, FunctionComponent, ReactElement, ElementType } from 'react';

  interface RouteContext {
    outlet: any;
    params: any;
    pathname: any;
    route: any;
  }

  interface RoutesProps {
    children: ReactNode;
    basename?: string;
    caseSensitive?: boolean;
  }

  export const Routes: FunctionComponent<RoutesProps>;

  interface BrowserRouterProps {
    children: ReactNode;
    timeout?: number;
    window?: Window;
  }

  export const BrowserRouter: FunctionComponent<BrowserRouterProps>;

  interface RouteProps {
    path: string;
    element?: ReactElement;
    chidren?: ReactNode;
  }

  export const Route: FunctionComponent<RouteProps>;

  export interface LinkProps {
    to: string;
    children: ReactNode;
    as?: ElementType;
    onClick?: VoidFunction;
    replace?: boolean;
    state?: Record<string, any>;
    target?: string;
  }

  export const Link: FunctionComponent<LinkProps>;

  export interface NavigateProps {
    to: string | { pathname: string; search: string; hash: string };
    replace?: boolean;
    state?: any;
  }

  export const Navigate: FunctionComponent<NavigateProps>;

  type navigate = (to: string) => void;

  export function useNavigate(): navigate;

  export interface ObjectRoute {
    path: string;
    element: ReactNode;
    children: Array<ObjectRoute>;
  }
}
