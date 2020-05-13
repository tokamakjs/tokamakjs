import { controller } from 'vendor/tokamak';

import { RootView, RootViewError } from './Root.view';

@controller({
  view: RootView,
  states: {
    error: RootViewError,
  },
})
export class RootController {}
