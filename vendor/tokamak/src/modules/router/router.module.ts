import { module } from '../../decorators';
import { RouterService } from './router.service';

@module({
  providers: [RouterService],
  exports: [RouterService],
})
export class RouterModule {}
