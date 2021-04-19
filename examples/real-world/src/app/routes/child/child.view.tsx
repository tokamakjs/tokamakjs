import { useController } from '@tokamakjs/react';
import React from 'react';

import { ChildController } from './child.controller';

export const ChildView = () => {
  const ctrl = useController(ChildController);

  return (
    <div>
      <h1>I'm the child</h1>
      Hello Tokamak (child) <button onClick={() => ctrl.doStuff()}>Click</button>
      <button onClick={() => ctrl.back()}>Back to root</button>
    </div>
  );
};
