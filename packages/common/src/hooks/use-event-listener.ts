import { useEffect } from 'react';

import { EventListener } from '../types';
import { EventEmitter } from '../utils';

/**
 * Automatically manages subbing and unsubbing from the
 * events emitted by an EventEmitter.
 *
 * ```ts
 * import { useEventListener } from '@tokamakjs/common';
 *
 * useEventEmitter(emitter, 'my-event', (e) => {
 *   console.log(`Event ${e} handled.`);
 * });
 * ```
 *
 * @category Hooks
 *
 * @typeParam T -
 * @typeParam K -
 * @param emitter - The event emitter to listen to.
 * @param eventKey - The key of the event to listen to.
 * @param listener - The handler function for the event.
 */
export function useEventListener<T, K extends keyof T>(
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
