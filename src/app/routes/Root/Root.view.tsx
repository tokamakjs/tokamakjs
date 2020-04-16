import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '~/components/Navbar';

export const RootView = () => {
  return (
    <Fragment>
      <Navbar />
      <Outlet />
    </Fragment>
  );
};
