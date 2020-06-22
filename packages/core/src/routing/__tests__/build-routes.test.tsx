import { ModuleMetadata } from '../../decorators';
import { AppContext } from '../../injection';
import { buildRoutes } from '../build-routes';

jest.mock('../create-route-component', () => {
  return {
    createRouteComponent: () => 'TEST_ROUTE_COMPONENT',
  };
});

describe('buildRoutes', () => {
  class RootController {}
  class LoginController {}
  class SignUpController {}
  class TestModule {}

  beforeEach(() => {
    const fakeModuleMetadata: ModuleMetadata = {
      routing: [
        {
          path: '/',
          controller: RootController,
          isIncluded: false,
          children: [
            { path: '/login', controller: LoginController, children: [], isIncluded: false },
            { path: '/sign-up', controller: SignUpController, children: [], isIncluded: false },
          ],
        },
      ],
    };

    Reflect.defineMetadata('self:module', fakeModuleMetadata, TestModule);
  });

  it('should return a routes config', () => {
    const fakeAppContext = {} as AppContext;
    const routes = buildRoutes(TestModule, fakeAppContext);

    expect(routes).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [],
              "element": <TEST_ROUTE_COMPONENT />,
              "path": "/login",
            },
            Object {
              "children": Array [],
              "element": <TEST_ROUTE_COMPONENT />,
              "path": "/sign-up",
            },
          ],
          "element": <TEST_ROUTE_COMPONENT />,
          "path": "/",
        },
      ]
    `);
  });
});
