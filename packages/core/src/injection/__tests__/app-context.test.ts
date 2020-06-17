import { AppContext } from '../app-context';
import { Container } from '../container';
import { ContainerScanner } from '../container-scanner';

jest.mock('../container');
jest.mock('../container-scanner');

describe('AppContext', () => {
  it('is not initialized by default', async () => {
    class RootModule {}
    const appContext = await AppContext.create(RootModule);
    expect(appContext.isInitialized).toBe(false);
  });

  it('creates a container', async () => {
    class RootModule {}
    await AppContext.create(RootModule);
    expect(Container.from).toHaveBeenCalledWith(RootModule);
  });

  describe('init()', () => {
    class RootModule {}
    let appContext: AppContext;

    const fakeModule = { callOnInit: jest.fn(), callOnDidInit: jest.fn() };

    const fakeContainer = {
      init: jest.fn(),
      modules: new Map([['1', fakeModule]]),
    };

    beforeAll(async () => {
      (Container.from as jest.Mock).mockImplementation(() => {
        return fakeContainer as any;
      });

      appContext = await AppContext.create(RootModule);
      await appContext.init();
    });

    it('initializes the container', () => {
      expect(fakeContainer.init).toHaveBeenCalledTimes(1);
    });

    it('creates a container scanner', () => {
      expect(ContainerScanner).toHaveBeenCalledWith(fakeContainer);
    });

    it('calls onModuleInit', () => {
      expect(fakeModule.callOnInit).toHaveBeenCalledTimes(1);
    });

    it('calls onModuleDidInit', () => {
      expect(fakeModule.callOnDidInit).toHaveBeenCalledTimes(1);
    });

    it('sets the AppContext as initialized', () => {
      expect(appContext.isInitialized).toBe(true);
    });

    it('does not run init again if called after being initialized', async () => {
      fakeContainer.init.mockReset();
      await appContext.init();
      expect(fakeContainer.init).not.toHaveBeenCalled();
    });
  });

  describe('get()', () => {
    class RootModule {}
    let appContext: AppContext;

    const fakeContainer = {
      init: jest.fn(),
      modules: new Map(),
    };

    const fakeProvider = {};

    const fakeScanner = {
      find: jest.fn().mockReturnValue(fakeProvider),
    };

    beforeAll(async () => {
      (Container.from as jest.Mock).mockImplementation(() => {
        return fakeContainer;
      });

      (ContainerScanner as jest.Mock).mockImplementation(() => {
        return fakeScanner;
      });

      appContext = await AppContext.create(RootModule);
    });

    it('throws an error if being used without the context being initialized', () => {
      expect(() => appContext.get('TEST_TOKEN')).toThrow('AppContext not initialized');
    });

    it('returns an instance of the requested provider based on the token', async () => {
      await appContext.init();
      const instance = appContext.get('TEST_TOKEN');
      expect(instance).toBe(fakeProvider);
    });
  });

  describe('addGlobalProvider()', () => {
    class RootModule {}
    let appContext: AppContext;

    const fakeContainer = {
      init: jest.fn(),
      modules: new Map(),
      addGlobalProvider: jest.fn(),
    };

    beforeAll(async () => {
      (Container.from as jest.Mock).mockImplementation(() => {
        return fakeContainer;
      });

      appContext = await AppContext.create(RootModule);
    });

    it('adds the global provider to the wrapped container', () => {
      const provider = { provide: 'TEST_TOKEN', useValue: 'TEST_VALUE' };
      appContext.addGlobalProvider(provider);
      expect(fakeContainer.addGlobalProvider).toHaveBeenCalledWith(provider);
    });

    it('throws an error if trying to add the global provider to an initialized AppContext', async () => {
      await appContext.init();
      expect(() =>
        appContext.addGlobalProvider({ provide: 'TEST_TOKEN', useValue: 'TEST_VALUE' }),
      ).toThrow('AppContext already initialized.');
    });
  });
});
