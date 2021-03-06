import { Link, useController } from '@tokamakjs/react';
import React from 'react';

import { ChildController } from './child.controller';

export const ChildView = () => {
  const ctrl = useController(ChildController);

  return (
    <div>
      <h1>I'm the child</h1>
      Hello Tokamak (child) <button onClick={() => ctrl.doStuff()}>Click</button>
      <Link href="/root">Go Back to Root</Link>
    </div>
  );
};
