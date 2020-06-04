import { RouterModule, createRoute, module } from 'vendor/tokamak';

import { AuthApi } from './api';
import { AuthQuery } from './queries';
import { LoginRoute } from './routes/login';
import { AuthStore } from './stores';

@module({
  routing: [createRoute('/login', LoginRoute)],
  providers: [AuthStore, AuthQuery, AuthApi],
  imports: [RouterModule],
  exports: [],
})
export class AuthModule {}
