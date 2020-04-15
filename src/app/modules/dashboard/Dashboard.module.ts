import { createRoute, module } from 'vendor/tokamak';

import { AuthModule } from '../auth/Auth.module';
import { DashboardApi } from './api/Dashboard.api';
import { Admin } from './routes/Admin';
import { Home } from './routes/Home';
import { UserStore } from './stores/User.store';

@module({
  routing: [createRoute('/', Home), createRoute('/admin', Admin)],
  providers: [UserStore, DashboardApi],
  imports: [AuthModule],
  exports: [UserStore],
})
export class DashboardModule {}
