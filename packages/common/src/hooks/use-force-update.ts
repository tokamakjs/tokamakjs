import { useCallback, useState } from 'react';

export function useForceUpdate(): () => void {
  const [, dispatch] = useState({});
  return useCallback(() => dispatch({}), [dispatch]);
}
