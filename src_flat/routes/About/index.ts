import { route } from 'vendor/tokamak';

import { AboutView } from './About.view';

@route({
  view: AboutView,
  // A controller is not required for "dumb" views
})
export class About {}
