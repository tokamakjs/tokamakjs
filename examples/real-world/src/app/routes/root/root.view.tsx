import { Link, Outlet, useAppContext, useController } from '@tokamakjs/react';
import React, { Fragment } from 'react';

import { RootController } from './root.controller';

export const RootView = () => {
  const context = useAppContext();
  const ctrl = useController(RootController);

  console.log('App Context', context);

  return (
    <Fragment>
      <div>
        Hello Tokamak (root) <button onClick={() => ctrl.doStuff()}>Click</button>
      </div>
      <div>
        {ctrl.counter} - <button onClick={() => ctrl.counter++}>Increase Counter</button>
      </div>
      <Link href="/child/12">Go To Child</Link>
      <h2>Children starts from here: </h2>
      <Outlet />
    </Fragment>
  );
};
