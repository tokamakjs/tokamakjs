import { createRoute, module } from 'vendor/tokamak';

import { AuthModule } from '../auth/auth.module';
import { ProjectsQuery } from './queries';
import { HomeRoute } from './routes/home';
import { ProjectsStore } from './stores';

@module({
  routing: [createRoute('/', HomeRoute)],
  providers: [ProjectsQuery, ProjectsStore],
  imports: [AuthModule],
  exports: [ProjectsQuery],
})
export class DashboardModule {}
