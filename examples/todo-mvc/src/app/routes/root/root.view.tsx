import React, { Fragment } from 'react';

import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Main } from '~/components/Main';

export const RootView = () => {
  return (
    <Fragment>
      <Header />
      <Main />
      <Footer />
    </Fragment>
  );
};
