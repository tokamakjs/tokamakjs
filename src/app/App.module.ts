import { Module } from 'vendor/tokamak';

import { routing } from './routing';

@Module({
  /**
   * It's not the same as importing a module, as import/export is not related
   * with routes. In this case, even if you tried to use one of the exports
   * from AuthModule or DashboardModule in one of the hipothetical providers
   * of this module, it won't work because they're not imported first.
   *
   * However, the app would render normally in this case since we don't need
   * any of the exported providers from AuthModule or DashboardModule.
   */
  routing,
})
export class AppModule {}
