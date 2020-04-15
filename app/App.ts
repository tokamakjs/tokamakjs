import { Module, createRoute } from 'vendor/tokamak';

import { AuthModule } from './modules/auth/Auth.module';
import { DashboardModule } from './modules/dashboard/Dashboard.module';

@Module({
  /**
   * Routes could be a polymorphic function. If it takes a route directly,
   * it just renders the route under the path. If it takes a module, it will
   * render every route inside the module prefixed with the path.
   *
   * It's not the same as importing a module, as import/export is not related
   * with routes. In this case, even if you tried to use one of the exports
   * from AuthModule or DashboardModule in one of the hipothetical providers
   * of this module, it won't work because they're not imported first.
   *
   * However, the app would render normally in this case since we don't need
   * any of the exported providers from AuthModule or DashboardModule.
   */
  routes: [createRoute('/auth', AuthModule), createRoute('/', DashboardModule)],
})
export class App {}
