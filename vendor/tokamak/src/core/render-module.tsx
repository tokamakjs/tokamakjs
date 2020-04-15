import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import { Constructor } from '../types';
import { buildRoutes } from './build-routes';

export function renderModule(App: Constructor, selector: string) {
  const routes = buildRoutes(App);
  const RootNode = () => useRoutes(routes);

  render(
    <Router>
      <RootNode />
    </Router>,
    document.querySelector(selector),
  );
}
