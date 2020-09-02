import React from 'react';

import { RootController } from './root.controller';

export const RootView = (ctrl: RootController) => {
  return (
    <div>
      Hello Tokamak <button onClick={() => ctrl.doStuff()}>Click</button>
    </div>
  );
};
