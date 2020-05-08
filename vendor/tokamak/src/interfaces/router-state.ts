import { Location } from 'history';

import { Params } from '../routing';

export interface RouterState {
  location: Location;
  params: Params;
}
