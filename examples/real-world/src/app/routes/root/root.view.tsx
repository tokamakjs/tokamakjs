import { Outlet } from '@tokamakjs/core';
import React, { Fragment } from 'react';

import { RootController } from './root.controller';

export const RootView = (ctrl: RootController) => {
  return (
    <Fragment>
      <div>
        Hello Tokamak (root) <button onClick={() => ctrl.doStuff()}>Click</button>
      </div>
      <Outlet />
    </Fragment>
  );
};
