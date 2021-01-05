import { Location } from 'history';
import { useContext } from 'react';

import { LocationContext } from '../location-context';

export function useLocation(): Location {
  return useContext(LocationContext).location as Location;
}
