import { FunctionComponent } from 'react';

import { Navbar } from '~/components/Navbar';

declare const Outlet: FunctionComponent;

export const RootView = () => {
  return (
    <div>
      <Navbar />
      {/* This outlet will render children routes */}
      <Outlet />
    </div>
  );
};
