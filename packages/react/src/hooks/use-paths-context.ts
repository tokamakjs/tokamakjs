import { useContext } from 'react';

import { PathsContext } from '../tokamak-app';

export function usePathsContext(): Array<string> {
  return useContext(PathsContext);
}
