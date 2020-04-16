import { route } from 'vendor/tokamak';

import { LoginController } from './Login.controller';
import { LoginView } from './Login.view';

@route({
  view: LoginView,
  controller: LoginController,
})
export class LoginRoute {}
