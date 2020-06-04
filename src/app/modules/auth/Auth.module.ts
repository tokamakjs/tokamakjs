import { RouterModule, createRoute, module } from 'vendor/tokamak';

import { AuthApi } from './api';
import { AuthQuery } from './queries';
import { CurrentUserQuery } from './queries/current-user.query';
import { LoginRoute } from './routes/login';
import { LocalStorageService } from './services';
import { AuthStore } from './stores';
import { CurrentUserStore } from './stores/current-user.store';

@module({
  routing: [createRoute('/login', LoginRoute)],
  providers: [
    AuthStore,
    AuthQuery,
    AuthApi,
    LocalStorageService,
    CurrentUserQuery,
    CurrentUserStore,
  ],
  imports: [RouterModule],
  exports: [AuthQuery, CurrentUserQuery],
})
export class AuthModule {}
