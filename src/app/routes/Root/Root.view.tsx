import React, { Fragment } from 'react';
import { Outlet } from 'vendor/tokamak';

import { Navbar } from '~/components/Navbar';

import { RootController } from './Root.controller';

export const RootViewError = () => {
  return <div>Error rendering the app</div>;
};

export const RootView = (ctrl: RootController) => {
  return (
    <Fragment>
      <Navbar />
      <Outlet />
      <h1>Is Loading: {String(ctrl.isLoading)}</h1>
      <button onClick={() => ctrl.login()}>Login</button>
    </Fragment>
  );
};
