import { Location } from 'history';
import qs from 'query-string';

import { Params } from '../routing';

export interface RouterState {
  location: Location;
  params: Params;
  query: qs.ParsedQuery;
}
