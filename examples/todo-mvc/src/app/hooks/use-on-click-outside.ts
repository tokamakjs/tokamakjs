import { useRef } from 'react';
import _useOnClickOutside from 'use-onclickoutside';

export function useOnClickOutside<T extends HTMLElement>(
  callback: VoidFunction,
): React.RefObject<T> {
  const inputRef = useRef<T>(null);

  _useOnClickOutside(inputRef, callback);

  return inputRef;
}
