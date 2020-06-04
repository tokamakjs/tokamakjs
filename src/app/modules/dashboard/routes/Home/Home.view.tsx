import React, { Fragment } from 'react';
import { Link } from 'vendor/tokamak';

import { HomeController } from './home.controller';

export const HomeView = (ctrl: HomeController) => {
  return (
    <Fragment>
      <h1>Home</h1>
      {ctrl.authToken != null ? <h2>Auth Token: {ctrl.authToken}</h2> : null}
      <Link href="/auth/login">Login</Link>
      <p>
        <button onClick={() => ctrl.logout()}>Logout</button>
      </p>
    </Fragment>
  );
};
