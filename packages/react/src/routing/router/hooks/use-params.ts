import { useContext } from 'react';

import { RouteContext } from '../route-context';

export function useParams(): Record<string, string> {
  return useContext(RouteContext).params;
}
