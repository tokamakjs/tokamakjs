import { History, Location } from 'history';
import { createContext } from 'react';

export const LocationContext = createContext<{
  history?: History;
  location?: Location;
}>({
  history: undefined,
  location: undefined,
});
