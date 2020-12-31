export interface Context {
  id: string;
}

// Default context for instances
export const DEFAULT_CONTEXT: Context = Object.freeze({ id: '1' });
