import { FunctionComponent } from 'react';

import { Navbar } from '~/components/Navbar';

declare const Outlet: FunctionComponent<{ data?: any }>;

export const RootView = () => {
  // Here is a good place to put all the providers
  // necessary for the app as well.
  return (
    <div>
      <Navbar />
      {/* This outlet will render children routes */}
      <Outlet />
      {/* It's also possible to pass data to children using the data prop */}
      <Outlet data={{ hello: 'world' }} />
    </div>
  );
};
