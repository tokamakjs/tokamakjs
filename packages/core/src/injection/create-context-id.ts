import { v4 } from 'uuid';

import { Context } from './constants';

export function createContextId(): Context {
  return { id: v4() };
}
