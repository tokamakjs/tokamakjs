import { SubAppMetadata } from '../../types';
import { buildRoutes } from '../build-routes';

// jest.mock('../create-route-component', () => {
//   return {
//     createRouteComponent: () => ({
//       Route: 'TEST_ROUTE_COMPONENT',
//       controllerInstance: 'TEST_CONTROLLER_INSTANCE',
//     }),
//   };
// });

describe.skip('buildRoutes', () => {
  const RootView = () => null;
  const LoginView = () => null;
  const SignUpView = () => null;
  class TestModule {}

  beforeEach(() => {
    const fakeSubAppMetadata: SubAppMetadata = {
      routing: [
        {
          path: '/',
          Component: RootView,
          children: [
            { path: '/login', Component: LoginView, children: [] },
            { path: '/sign-up', Component: SignUpView, children: [] },
          ],
        },
      ],
    };

    Reflect.defineMetadata('self:subapp', fakeSubAppMetadata, TestModule);
  });

  it('should return a routes config', () => {
    const fakeAppContext = {} as any;
    const routes = buildRoutes(TestModule, fakeAppContext);

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
