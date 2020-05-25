import { createRoute, includeRoutes, module } from 'vendor/tokamak';

import { AuthStore } from './Auth.store';
import { AuthApi } from './modules/auth/api/Auth.api';
import { LocalStorageService } from './modules/auth/services';
// import { AuthModule } from './modules/auth/Auth.module';
// import { DashboardModule } from './modules/dashboard/Dashboard.module';
import { AboutRoute } from './routes/About';
import { RootRoute } from './routes/Root';
import { TestQuery, TestService, TestStore } from './Test.store';

@module({
  routing: [
    createRoute('*', RootRoute, [
      // includeRoutes('/auth', AuthModule),
      // includeRoutes('/', DashboardModule),
    ]),
    createRoute('/about', AboutRoute),
  ],
  providers: [TestStore, TestQuery, TestService, AuthStore, AuthApi, LocalStorageService],
  // imports: [AuthModule, DashboardModule],
})
export class AppModule {}
