import { createRoute, includeRoutes, module } from 'vendor/tokamak';

import { AuthModule } from './modules/auth/Auth.module';
import { DashboardModule } from './modules/dashboard/Dashboard.module';
import { About } from './routes/About';
import { Root } from './routes/Root';

@module({
  routing: [
    createRoute('*', Root, [
      includeRoutes('/auth', AuthModule),
      includeRoutes('/', DashboardModule),
    ]),
    createRoute('/about', About),
  ],
})
export class AppModule {}
