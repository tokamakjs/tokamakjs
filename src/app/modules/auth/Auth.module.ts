import { createRoute, module } from 'vendor/tokamak';

import { LoginRoute } from './routes/login';

@module({
  routing: [createRoute('/login', LoginRoute)],
  providers: [],
  imports: [],
  exports: [],
})
export class AuthModule {}
