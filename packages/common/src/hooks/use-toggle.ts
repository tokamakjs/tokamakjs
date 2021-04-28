import { useState } from 'react';

export function useToggle(defaults: boolean = false): [boolean, VoidFunction] {
  const [value, setValue] = useState(defaults);
  return [value, () => setValue(!value)];
}
