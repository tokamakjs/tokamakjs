import { useState } from 'react';

export function useToggle(defaults: boolean): [value: boolean, toggler: VoidFunction] {
  const [value, setValue] = useState(defaults);
  return [value, () => setValue(!value)];
}
