import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import { Container } from '../injection';
import { buildRoutes } from '../routing';
import { Type } from '../types';
import { Context } from './Context';
import { GraphScanner } from './GraphScanner';

export async function renderModule(RootModule: Type, selector: string) {
  const container = new Container();
  const scanner = new GraphScanner();

  const nodes = await scanner.scan(RootModule);
  await container.addNodes(nodes);
  await container.initialize();

  const appContext = new Context(container);

  const routes = buildRoutes(RootModule, appContext);
  const RootNode = () => useRoutes(routes);

  render(
    <Router>
      <RootNode />
    </Router>,
    document.querySelector(selector),
  );
}
