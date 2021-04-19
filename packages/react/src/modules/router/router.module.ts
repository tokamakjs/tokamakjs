import { RouterService } from '@tokamakjs/common';
import { Module } from '@tokamakjs/injection';

import { RouterHookService } from './router.hook-service';

@Module({
  // We have to use "any" here since abstract classes are not a valid Token per se.
  providers: [{ provide: RouterService as any, useClass: RouterHookService }],
  exports: [RouterService as any],
})
export class RouterModule {}
