import { createElement } from 'react';
import { render } from 'react-dom';

import { Constructor } from '../types';
import { buildRoutes } from './build-routes';

export function renderModule(App: Constructor, selector: string) {
  const routes = buildRoutes(App);

  console.log(routes);

  render(createElement('div'), document.querySelector(selector));
}
