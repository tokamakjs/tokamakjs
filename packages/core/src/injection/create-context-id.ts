import { v4 } from 'uuid';

export interface ContextId {
  id: string;
}

export function createContextId(): ContextId {
  return { id: v4() };
}
