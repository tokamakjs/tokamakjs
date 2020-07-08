import { useEffect } from 'react';

import { EventEmitter, Listener } from '../utils';

/**
 * Automatically manages subbing and unsubbing from the
 * events emitted by an EventEmitter.
 */
export function useEventListener<T>(
  emitter: EventEmitter<T>,
  eventKey: keyof T,
  listener: Listener<T[keyof T]>,
): void {
  useEffect(() => {
    emitter.addEventListener(eventKey, listener);
    return () => {
      emitter.removeEventListener(eventKey, listener);
    };
  });
}
