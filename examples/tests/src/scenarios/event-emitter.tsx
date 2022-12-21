import { EventEmitter, useEventListener } from '@tokamakjs/common';
import {
  Controller,
  SubApp,
  TokamakApp,
  createRoute,
  ref,
  state,
  useController,
} from '@tokamakjs/react';
import React from 'react';

interface ErrorEvent {
  code: string;
  message: string;
}

interface SuccessEvent {
  result: string;
}

interface ControllerEmitter {
  error: ErrorEvent;
  success: SuccessEvent;
}

const MainView = () => {
  const ctrl = useController<MainController>();

  // TODO: This fails because tokamak/common and tokamak/react both
  // have their own version of react installed. Looks like a lerna limitation?

  // useEventListener(ctrl.emitter, 'error', (e) => {
  //   console.log(`ERROR: code ${e.code} - message ${e.message}`);
  // });

  // useEventListener(ctrl.emitter, 'success', (e) => {
  //   console.log(`SUCCESS: message ${e.result}`);
  // });

  return (
    <div>
      <h1>Main View</h1>
      <h2>Counter: {ctrl.counter}</h2>
      <p>
        <button onClick={() => (ctrl.counter += 1)}>Increase</button>
      </p>
      <p>
        <button onClick={() => ctrl.triggerError()}>Trigger Error</button>
      </p>
      <p>
        <button onClick={() => ctrl.triggerSuccess()}>Trigger Success</button>
      </p>
    </div>
  );
};

@Controller({ view: MainView })
class MainController {
  @ref public readonly emitter = new EventEmitter<ControllerEmitter>();

  @state public counter = 0;

  public triggerError() {
    this.emitter.emit('error', { code: 'ERR', message: 'This is an error string' });
  }

  public triggerSuccess() {
    this.emitter.emit('success', { result: 'This is the result string' });
  }
}

@SubApp({
  routing: [createRoute('/', MainController, [])],
  providers: [],
  imports: [],
})
class AppModule {}

async function test() {
  const app = await TokamakApp.create(AppModule);
  app.render('#root');
}

test();
