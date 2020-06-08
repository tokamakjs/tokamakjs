import { renderModule } from 'vendor/tokamak';

import { AppModule } from './app/app.module';

async function bootstrap() {
  renderModule(AppModule, '#root');
}

bootstrap();
