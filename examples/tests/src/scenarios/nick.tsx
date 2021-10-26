/* eslint-disable no-console */

/**
 * This example demonstrates how to use hooks directly
 * inside controllers.
 *
 * Pay attention to the fact that we use the hooks from
 * @tokamakjs/react and not directly from react;
 */

import {
  Controller,
  React,
  SubApp,
  TokamakApp,
  createRoute,
  useController,
  useState,
} from '@tokamakjs/react';

const MainView = () => {
  const ctrl = useController<MainController>();
  return (
    <div>
      <button onClick={() => ctrl.loading[1](ctrl.loading[0] + 1)}>Increase</button>
      <pre>{JSON.stringify(ctrl.loading, null, 2)}</pre>
    </div>
  );
};

@Controller({ view: MainView })
class MainController {
  private _loading = useState(0);

  get loading() {
    return this._loading;
  }
}

@SubApp({
  routing: [createRoute('/', MainController)],
  providers: [],
  imports: [],
})
class App {}

async function bootstrap() {
  const app = await TokamakApp.create(App);
  app.render('#root');
}

bootstrap();
