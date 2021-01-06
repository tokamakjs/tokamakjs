import { SubAppMetadata } from '../../types';
import { buildRoutes } from '../build-routes';

jest.mock('../create-route-component', () => {
  return {
    createRouteComponent: () => ({
      Route: 'TEST_ROUTE_COMPONENT',
      controllerInstance: 'TEST_CONTROLLER_INSTANCE',
    }),
  };
});

describe('buildRoutes', () => {
  class RootController {}
  class LoginController {}
  class SignUpController {}
  class TestModule {}

  beforeEach(() => {
    const fakeSubAppMetadata: SubAppMetadata = {
      routing: [
        {
          path: '/',
          controller: RootController,
          children: [
            { path: '/login', controller: LoginController, children: [] },
            { path: '/sign-up', controller: SignUpController, children: [] },
          ],
        },
      ],
    };

    Reflect.defineMetadata('self:subapp', fakeSubAppMetadata, TestModule);
  });

  it('should return a routes config', async () => {
    const fakeAppContext = {} as any;
    const routes = await buildRoutes(TestModule, fakeAppContext);

    expect(routes).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [],
              "controller": "TEST_CONTROLLER_INSTANCE",
              "element": <TEST_ROUTE_COMPONENT />,
              "path": "/login",
            },
            Object {
              "children": Array [],
              "controller": "TEST_CONTROLLER_INSTANCE",
              "element": <TEST_ROUTE_COMPONENT />,
              "path": "/sign-up",
            },
          ],
          "controller": "TEST_CONTROLLER_INSTANCE",
          "element": <TEST_ROUTE_COMPONENT />,
          "path": "/",
        },
      ]
    `);
  });
});
