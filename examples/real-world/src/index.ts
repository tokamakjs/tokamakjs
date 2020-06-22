import { renderModule } from '@tokamakjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  renderModule(AppModule, '#root');
}

bootstrap();
