import { renderModule } from '../render-module';

describe('renderModule', () => {
  class RootModule {}

  beforeAll(() => {
    renderModule(RootModule, '#root');
  });

  it('creates the app context using the provided root module', () => {});

  it('creates browser history', () => {});

  it('adds the created history to the global providers', () => {});

  it('initializes the app context', () => {});

  it('builds the app routes', () => {});

  it('renders the react app in the provided selector', () => {});
});
