import { createRoute, includeRoutes, module } from 'vendor/tokamak';

import { AuthModule } from './modules/auth/Auth.module';
import { DashboardModule } from './modules/dashboard/Dashboard.module';
import { About } from './routes/About';
import { Root } from './routes/Root';

@module({
  /**
   * It's not the same as importing a module, as import/export is not related
   * with routes. In this case, even if you tried to use one of the exports
   * from AuthModule or DashboardModule in one of the hipothetical providers
   * of this module, it won't work because they're not imported first.
   *
   * However, the app would render normally in this case since we don't need
   * any of the exported providers from AuthModule or DashboardModule.
   */
  routing: [
    createRoute('*', Root, [
      includeRoutes('/auth', AuthModule),
      includeRoutes('/', DashboardModule),
    ]),
    createRoute('/about', About),
    /**
     * It's also possible to nest createRoutes
     *
     * Either without root view (just prefixes the children):
     *
     * createRoute('/admin', [
     *   createRoute('/', AdminHome),
     *   createRoute('/users', AdminUsers),
     * ]),
     *
     * Or having a root view (necessary to use <Outlet />)
     *
     * createRoute('/admin', Admin, [
     *   createRoute('/', AdminHome),
     *   createRoute('/users', AdminUsers),
     * ]);
     */
  ],
})
export class AppModule {}
