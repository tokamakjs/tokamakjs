import { ReactNode } from 'react';

export interface ErrorHandler<T extends Error = Error> {
  catch: (error: T) => void;
  render?: () => ReactNode;
}
