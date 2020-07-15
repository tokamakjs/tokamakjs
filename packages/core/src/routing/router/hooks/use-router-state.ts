import qs from 'query-string';

import { RouterState } from '../../../interfaces';
import { useLocation } from './use-location';
import { useParams } from './use-params';

export function useRouterState(): RouterState {
  const params = useParams();
  const location = useLocation();

  const { search } = location;
  const query = qs.parse(search);

  return { params, location, query };
}
