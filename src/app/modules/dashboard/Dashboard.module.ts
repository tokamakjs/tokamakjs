import { createRoute, module } from 'vendor/tokamak';

import { AuthModule } from '../auth/auth.module';
import { HomeRoute } from './routes/home';

@module({
  routing: [createRoute('/', HomeRoute)],
  providers: [],
  imports: [AuthModule],
  exports: [],
})
export class DashboardModule {}
