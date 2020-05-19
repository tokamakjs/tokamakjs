import { RouterState } from 'vendor/tokamak/src/interfaces';

import { useLocation } from './use-location';
import { useParams } from './use-params';

export function useRouterState(): RouterState {
  const params = useParams();
  const location = useLocation();

  return { params, location };
}
