import { createElement } from 'react';
import { render } from 'react-dom';

import { Constructor } from '../types';

export function renderModule(App: Constructor, selector: string) {
  const app = new App();
  console.log(app);
  render(createElement('div'), document.querySelector(selector));
}
