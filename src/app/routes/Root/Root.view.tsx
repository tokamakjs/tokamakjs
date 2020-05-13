import React, { Fragment } from 'react';
import { Outlet } from 'vendor/tokamak';

import { Navbar } from '~/components/Navbar';

export const RootViewError = () => {
  return <div>Error rendering the app</div>;
};

export const RootView = () => {
  return (
    <Fragment>
      <Navbar />
      <Outlet />
    </Fragment>
  );
};
