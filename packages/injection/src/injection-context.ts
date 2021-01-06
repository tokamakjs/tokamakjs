import { InjectionContext } from './types';

export enum Scope {
  SINGLETON = 'SINGLETON',
  TRANSIENT = 'TRANSIENT',
}

export const DEFAULT_INJECTION_CONTEXT = Object.freeze({ id: '1' });

export function createInjectionContext(): InjectionContext {
  return { id: Math.random().toString() };
}
