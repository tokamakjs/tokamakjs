import { Module, createRoute } from 'vendor/tokamak';

import { Api } from './api/api';
import { Admin } from './routes/Admin';
import { Home } from './routes/Home';
import { Login } from './routes/Login';
import { SignUp } from './routes/SignUp';
import { AuthStore } from './stores/Auth.store';
import { UserStore } from './stores/User.store';

@Module({
  routes: [
    createRoute('/', Home),
    createRoute('/login', Login),
    createRoute('/sign-up', SignUp),
    createRoute('/admin', Admin),
  ],
  providers: [AuthStore, UserStore, Api],
  imports: [],
  exports: [AuthStore, UserStore],
})
export class App {}
