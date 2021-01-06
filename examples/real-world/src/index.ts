import { TokamakApp } from '@tokamakjs/react';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await TokamakApp.create(AppModule);

  app.setAppContext({ hello: 'world' });

  app.render('#root');
}

bootstrap();
