import { Route } from 'vendor/tokamak';

import { AboutView } from './About.view';

@Route({
  view: AboutView,
  // A controller is not required for "dumb" views
})
export class About {}
