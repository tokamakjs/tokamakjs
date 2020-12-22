import { Module } from '@tokamakjs/core';

import { RouterService } from './router.service';

@Module({
  providers: [RouterService],
  exports: [RouterService],
})
export class RouterModule {}
