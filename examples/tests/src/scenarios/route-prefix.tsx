import { Controller, SubApp, TokamakApp, createRedirection, createRoute } from '@tokamakjs/react';
import React from 'react';

const MainView = () => {
  return <h1>MainView</h1>;
};

@Controller({ view: MainView })
class MainController {}

const LoginView = () => {
  return <h1>LoginView</h1>;
};

@Controller({ view: LoginView })
class LoginController {}

const UserMainView = () => {
  return <h1>UserMainView</h1>;
};

@Controller({ view: UserMainView })
class UserMainController {}

const UserLoginView = () => {
  return <h1>UserLoginView</h1>;
};

@Controller({ view: UserLoginView })
class UserLoginController {}

@SubApp({
  routing: [
    createRoute('/admin', [
      createRoute('/', MainController),
      createRoute('/login', LoginController),
    ]),
    createRoute('/user', [
      createRoute('/', UserMainController),
      createRoute('/login', UserLoginController),
    ]),
    createRedirection('/', '/user/login'),
  ],
})
class App {}

async function bootstrap() {
  const app = await TokamakApp.create(App);
  app.render('#root');
}

bootstrap();
