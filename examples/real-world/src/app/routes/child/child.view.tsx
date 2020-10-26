import React from 'react';

import { ChildController } from './child.controller';

export const ChildView = (ctrl: ChildController) => {
  return (
    <div>
      Hello Tokamak (child) <button onClick={() => ctrl.doStuff()}>Click</button>
    </div>
  );
};
