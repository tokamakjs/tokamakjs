import { createRoute, module } from 'vendor/tokamak';

import { AuthModule } from '../auth/auth.module';
import { DashboardApi } from './api';
import { ProjectsQuery } from './queries';
import { HomeRoute } from './routes/home';
import { ProjectsStore } from './stores';

@module({
  routing: [createRoute('/', HomeRoute)],
  providers: [ProjectsQuery, ProjectsStore, DashboardApi],
  imports: [AuthModule],
  exports: [ProjectsQuery],
})
export class DashboardModule {}
