import { renderModule } from 'vendor/tokamak';

import { AppModule } from './app/App.module';

async function bootstrap() {
  renderModule(AppModule, '#root');
}

bootstrap();
