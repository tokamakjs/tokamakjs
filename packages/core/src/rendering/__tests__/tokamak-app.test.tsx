import * as history from 'history';
import { render } from 'react-dom';

// @ts-ignore
import { AppContext } from '../../injection';
import { HISTORY, buildRoutes } from '../../routing';
import { tokamak } from '../tokamak-app';

jest.mock('react');
jest.mock('react-dom');
jest.mock('history');

jest.mock('../../injection');
jest.mock('../../routing');

describe('renderModule', () => {
  class RootModule {}

  const fakeAppContext = {
    addGlobalProvider: jest.fn(),
    init: jest.fn(),
  };

  const fakeHistory = {};

  let app: { render: (selector: string) => void };

  beforeAll(async () => {
    jest.spyOn(AppContext, 'create').mockImplementation(async () => {
      return (fakeAppContext as unknown) as AppContext;
    });

    jest.spyOn(history, 'createBrowserHistory').mockImplementation(() => {
      return fakeHistory as any;
    });

    app = await tokamak(RootModule);
    app.render('#root');
  });

  it('returns an app that can be rendered to a selector', () => {
    expect(app).toBeDefined();
    expect(typeof app.render).toBe('function');
  });

  it('creates the app context using the provided root module', () => {
    expect(AppContext.create).toHaveBeenCalledWith(RootModule);
  });

  it('creates browser history', () => {
    expect(history.createBrowserHistory).toHaveBeenCalledTimes(1);
  });

  it('adds the created history to the global providers', () => {
    expect(fakeAppContext.addGlobalProvider).toHaveBeenCalledWith({
      provide: HISTORY,
      useValue: fakeHistory,
    });
  });

  it('initializes the app context', () => {
    expect(fakeAppContext.init).toHaveBeenCalledTimes(1);
  });

  it('builds the app routes', () => {
    expect(buildRoutes).toHaveBeenCalledWith(RootModule, fakeAppContext);
  });

  it('renders the react app in the provided selector', () => {
    expect((render as jest.Mock).mock.calls[0][1]).toEqual(document.querySelector('#root'));
  });
});
