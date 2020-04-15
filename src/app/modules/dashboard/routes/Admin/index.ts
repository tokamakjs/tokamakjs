import { route } from 'vendor/tokamak';

import { AdminView } from './Admin.controller';

@route({
  view: AdminView,
})
export class Admin {}
