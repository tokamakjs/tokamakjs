import 'todomvc-common/base.js';

import { renderModule } from '@tokamakjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  renderModule(AppModule, '.todoapp');
}

bootstrap();
