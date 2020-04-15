import { Module, createRoute } from 'vendor/tokamak';

import { AuthApi } from './api/Auth.api';
import { Login } from './routes/Login';
import { SignUp } from './routes/SignUp';
import { AuthStore } from './stores/Auth.store';

@Module({
  routes: [createRoute('/login', Login), createRoute('/sign-up', SignUp)],
  providers: [AuthStore, AuthApi],
  imports: [],
  exports: [AuthStore],
})
export class AuthModule {}
