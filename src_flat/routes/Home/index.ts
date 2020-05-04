import { route, useGuards } from 'vendor/tokamak';

import { AuthGuard } from '~/modules/auth/guards';

import { HomeController } from './Home.controller';
import { HomeView } from './Home.view';

@route({ controller: HomeController, view: HomeView })
@useGuards(AuthGuard)
export class HomeRoute {}
