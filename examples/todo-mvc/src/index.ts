import 'todomvc-common/base.js';

import { TokamakApp } from '@tokamakjs/react';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await TokamakApp.create(AppModule);
  app.render('.todoapp');
}

bootstrap();
