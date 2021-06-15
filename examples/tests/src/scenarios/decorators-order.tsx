/* eslint-disable no-console, jest/no-disabled-tests, jest/expect-expect */

import {
  Controller,
  RouterModule,
  SubApp,
  TokamakApp,
  createRoute,
  effect,
  onDidMount,
  state,
  useController,
} from '@tokamakjs/react';
import React from 'react';

const MainView = () => {
  const ctrl = useController<MainController>();

  return (
    <div>
      {ctrl.counter}
      <button onClick={() => (ctrl.counter += 1)}>Increase</button>
    </div>
  );
};

@Controller({ view: MainView })
class MainController {
  @state public counter = 0;

  @onDidMount()
  protected onDidMount(): void {
    console.log('onDidMount');
  }

  @effect((self: MainController) => [self.counter])
  protected async onCounterDidChange(): Promise<void> {
    console.log('onCounterDidChange');
  }
}

@SubApp({
  routing: [createRoute('/', MainController)],
  providers: [],
  imports: [RouterModule],
})
class MainApp {}

async function bootstrap() {
  const app = await TokamakApp.create(MainApp);
  app.render('#root');
}

bootstrap();
