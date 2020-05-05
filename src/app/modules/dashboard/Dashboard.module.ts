import { createRoute, module } from 'vendor/tokamak';

import { AuthModule } from '../auth/Auth.module';
import { DashboardApi } from './api/Dashboard.api';
import { AdminRoute } from './routes/Admin';
import { HomeRoute } from './routes/Home';
import { UserStore } from './stores/User.store';

@module({
  routing: [createRoute('/', HomeRoute), createRoute('/admin', AdminRoute)],
  providers: [UserStore, DashboardApi],
  imports: [AuthModule],
  exports: [UserStore],
})
export class DashboardModule {}
