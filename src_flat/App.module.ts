import { createRoute, module } from 'vendor/tokamak';

import { About } from './routes/About';
import { HomeRoute } from './routes/Home';
import { LoginRoute } from './routes/Login';
import { RootRoute } from './routes/Root';
import { SignUpRoute } from './routes/SignUp';

@module({
  routing: [
    createRoute('*', RootRoute, [
      createRoute('/auth', [
        createRoute('/login', LoginRoute),
        createRoute('/sign-up', SignUpRoute),
      ]),
      createRoute('/', [createRoute('/', HomeRoute)]),
    ]),
    createRoute('/about', About),
  ],
  imports: [],
})
export class AppModule {}
