/* eslint-disable no-console */

import { Controller, SubApp, TokamakApp, createRoute, includeRoutes } from '@tokamakjs/react';
import React from 'react';

/**
 * This example demonstrates how to use basePath
 * and how that option behaves when used in a TokamakApp.
 */

const LoginView = () => {
  return <div>Login</div>;
};

@Controller({ view: LoginView })
class LoginController {}

@SubApp({
  routing: [createRoute('/login', LoginController)],
})
class AuthModule {}

@SubApp({
  routing: [includeRoutes('/', AuthModule)],
  imports: [AuthModule],
})
class AppModule {}

async function bootstrap(): Promise<void> {
  const app = await TokamakApp.create(AppModule, { basePath: '/auth' });
  app.render('#root');
}

bootstrap();
