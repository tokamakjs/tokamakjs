import { route } from 'vendor/tokamak';

import { HomeController } from './Home.controller';
import { HomeView } from './Home.view';

@route({ controller: HomeController, view: HomeView })
export class Home {}
