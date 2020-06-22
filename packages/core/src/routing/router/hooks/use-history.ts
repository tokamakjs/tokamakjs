import { History } from 'history';
import { useContext } from 'react';

import { LocationContext } from '../location-context';

export function useHistory(): History {
  return useContext(LocationContext).history as History;
}
