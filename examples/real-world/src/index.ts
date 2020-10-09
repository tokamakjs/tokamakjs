import { tokamak } from '@tokamakjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await tokamak(AppModule);
  app.render('#root');
}

bootstrap();
