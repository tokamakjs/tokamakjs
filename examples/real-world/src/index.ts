import { TokamakApp } from '@tokamakjs/react';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await TokamakApp.create(AppModule);
  app.render('#root', { hello: 'world' });
}

bootstrap();
