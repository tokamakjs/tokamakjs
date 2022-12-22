import { useEffect } from 'react';

import { EventListener } from '../types';
import { EventEmitter } from '../utils';

/**
 * Automatically manages subbing and unsubbing from the
 * events emitted by an EventEmitter.
 */
export function useEventListener<T extends Record<string, any>, K extends keyof T>(
  emitter: EventEmitter<T>,
  eventKey: K,
  listener: EventListener<T[K]>,
): void {
  useEffect(() => {
    const cancelSub = emitter.on(eventKey, listener);

    return () => {
      cancelSub();
    };
  });
}
