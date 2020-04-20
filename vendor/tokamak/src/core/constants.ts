export interface Context {
  id: number;
}

// Default context for instances
export const DEFAULT_CONTEXT: Context = Object.freeze({ id: 1 });
