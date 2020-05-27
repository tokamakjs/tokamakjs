import { useCallback, useState } from 'react';

type ForceUpdater = () => void;

export function useForceUpdate(): ForceUpdater {
  const [, setState] = useState();
  return useCallback(() => setState({}), []);
}
