import { createContext, useContext } from 'react';

export const PathsContext = createContext<Array<string>>([]);

export function usePathsContext(): Array<string> {
  return useContext(PathsContext);
}
