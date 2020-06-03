import { createRoute, includeRoutes, module } from 'vendor/tokamak';

import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AboutRoute } from './routes/about';
import { RootRoute } from './routes/root';

@module({
  routing: [
    createRoute('*', RootRoute, [
      includeRoutes('/auth', AuthModule),
      includeRoutes('/', DashboardModule),
    ]),
    createRoute('/about', AboutRoute),
  ],
  providers: [],
  imports: [AuthModule, DashboardModule],
})
export class AppModule {}
