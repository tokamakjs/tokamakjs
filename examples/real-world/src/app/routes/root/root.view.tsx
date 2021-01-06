import { Outlet, useAppContext } from '@tokamakjs/react';
import React, { Fragment } from 'react';

import { RootController } from './root.controller';

export const RootView = (ctrl: RootController) => {
  const context = useAppContext();

  console.log(context);

  return (
    <Fragment>
      <div>
        Hello Tokamak (root) <button onClick={() => ctrl.doStuff()}>Click</button>
      </div>
      <Outlet />
    </Fragment>
  );
};
