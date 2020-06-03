import { createRoute, module } from 'vendor/tokamak';

import { HomeRoute } from './routes/home';

@module({
  routing: [createRoute('/', HomeRoute)],
  providers: [],
  imports: [],
  exports: [],
})
export class DashboardModule {}
