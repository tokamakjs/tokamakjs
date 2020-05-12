import { createRoute, module } from 'vendor/tokamak';

import { AuthModule } from '../auth/Auth.module';
import { DashboardApi } from './api/Dashboard.api';
import { AdminRoute } from './routes/Admin';
import { HomeRoute } from './routes/Home';
import { ProjectsStore } from './stores';

@module({
  routing: [createRoute('/', HomeRoute), createRoute('/admin', AdminRoute)],
  providers: [DashboardApi, ProjectsStore],
  imports: [AuthModule],
  exports: [],
})
export class DashboardModule {}
