import React, { Fragment, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '~/components/Navbar';

export const RootView = () => {
  const [state, setState] = useState(1);
  return (
    <Fragment>
      <Navbar />
      <Outlet />
      {state}
      <button onClick={() => setState((s) => s + 1)}>Increase</button>
    </Fragment>
  );
};
