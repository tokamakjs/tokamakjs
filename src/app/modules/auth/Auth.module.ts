import { createRoute, module } from 'vendor/tokamak';

import { AuthApi } from './api/Auth.api';
import { LoginRoute } from './routes/Login';
import { SignUpRoute } from './routes/SignUp';
import { LocalStorageService } from './services';
import { AuthStore } from './stores/Auth.store';
import { CurrentUserStore } from './stores/CurrentUser.store';

@module({
  routing: [createRoute('/login', LoginRoute), createRoute('/sign-up', SignUpRoute)],
  providers: [AuthStore, AuthApi, LocalStorageService, CurrentUserStore],
  imports: [],
  exports: [AuthStore, CurrentUserStore],
})
export class AuthModule {}
