import { module } from '@tokamakjs/core';

import { RouterService } from './router.service';

@module({
  providers: [RouterService],
  exports: [RouterService],
})
export class RouterModule {}
