import { createRoute, includeRoutes, module } from 'vendor/tokamak';

import { AuthModule } from './modules/auth/Auth.module';
import { DashboardModule } from './modules/dashboard/Dashboard.module';
import { AboutRoute } from './routes/About';
import { RootRoute } from './routes/Root';

@module({
  routing: [
    createRoute('*', RootRoute, [
      includeRoutes('/auth', AuthModule),
      includeRoutes('/', DashboardModule),
    ]),
    createRoute('/about', AboutRoute),
  ],
  imports: [AuthModule, DashboardModule],
})
export class AppModule {}
