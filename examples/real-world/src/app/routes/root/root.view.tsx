import React from 'react';

import { RootController } from './root.controller';

export const RootView = (ctrl: RootController) => {
  return (
    <div>
      Hello Tokamak (root) <button onClick={() => ctrl.doStuff()}>Click</button>
    </div>
  );
};
