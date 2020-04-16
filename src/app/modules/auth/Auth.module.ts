import { createRoute, module } from 'vendor/tokamak';

import { AuthApi } from './api/Auth.api';
import { LoginRoute } from './routes/Login';
import { SignUpRoute } from './routes/SignUp';
import { AuthStore } from './stores/Auth.store';

@module({
  routing: [createRoute('/login', LoginRoute), createRoute('/sign-up', SignUpRoute)],
  providers: [AuthStore, AuthApi],
  imports: [],
  exports: [AuthStore],
})
export class AuthModule {}
