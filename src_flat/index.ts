import 'reflect-metadata';

import { renderModule } from 'vendor/tokamak';

import { AppModule } from './App.module';

async function bootstrap() {
  renderModule(AppModule, '#root');
}

bootstrap();
