import { createRoute, includeRoutes, module } from 'vendor/tokamak';

import { AuthModule } from './modules/auth/Auth.module';
import { DashboardModule } from './modules/dashboard/Dashboard.module';
import { About } from './routes/About';
import { RootRoute } from './routes/Root';

@module({
  routing: [
    createRoute('*', RootRoute, [
      includeRoutes('/auth', AuthModule),
      includeRoutes('/', DashboardModule),
    ]),
    createRoute('/about', About),
  ],
  imports: [AuthModule, DashboardModule],
})
export class AppModule {}
