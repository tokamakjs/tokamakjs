import { createRoute, includeRoutes } from 'vendor/tokamak';

import { AuthModule } from './modules/auth/Auth.module';
import { DashboardModule } from './modules/dashboard/Dashboard.module';
import { About } from './routes/About';
import { Root } from './routes/Root';

export const routing = [
  createRoute('*', Root, [
    includeRoutes('/login', AuthModule),
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
];
