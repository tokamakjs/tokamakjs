import { Module } from '@tokamakjs/injection';

import { RouterService } from './router.service';

@Module({
  providers: [RouterService],
  exports: [RouterService],
})
export class RouterModule {}
