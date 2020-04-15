import { Route } from 'vendor/tokamak';

import { HomeController } from './Home.controller';
import { HomeView } from './Home.view';

@Route({
  controller: HomeController,
  view: HomeView,
})
export class Home {}
