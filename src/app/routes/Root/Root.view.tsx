import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import { Navbar } from '~/components/Navbar';

export const RootView = () => {
  // Here is a good place to put all the providers
  // necessary for the app as well.
  return (
    <div>
      <Navbar />
      <p>
        <Link to="/about">Go to about</Link>
      </p>
      <p>
        <Link to="/auth/login">Go to login</Link>
      </p>
      {/* This outlet will render children routes */}
      <Outlet />
      {/* It's also possible to pass data to children using the data prop */}
      {/* <Outlet data={{ hello: 'world' }} /> */}
    </div>
  );
};
