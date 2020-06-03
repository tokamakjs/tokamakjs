import React, { Fragment } from 'react';
import { Link } from 'vendor/tokamak';

export const HomeView = () => {
  return (
    <Fragment>
      <h1>Home</h1>
      <Link href="/auth/login">Login</Link>
    </Fragment>
  );
};
