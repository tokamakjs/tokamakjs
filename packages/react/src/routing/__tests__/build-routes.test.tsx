import { Reflector } from '../../reflection';
import { SubAppMetadata } from '../../types';
import { buildRoutes } from '../build-routes';

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
          Controller: RootController,
          children: [
            { path: '/login', Controller: LoginController, children: [] },
            { path: '/sign-up', Controller: SignUpController, children: [] },
          ],
        },
      ],
    };

    Reflector.addSubAppMetadata(TestModule, fakeSubAppMetadata);

    Reflect.defineMetadata('self:subapp', fakeSubAppMetadata, TestModule);
  });

  it('should return a routes config', () => {
    const fakeAppContext = {} as any;
    const routes = buildRoutes(TestModule, fakeAppContext);

    expect(routes).toMatchInlineSnapshot(/* json */ `
      [
        {
          "caseSensitive": false,
          "children": [
            {
              "caseSensitive": false,
              "children": [],
              "element": <RouteWrapper
                Controller={[Function]}
              />,
              "path": "/login",
            },
            {
              "caseSensitive": false,
              "children": [],
              "element": <RouteWrapper
                Controller={[Function]}
              />,
              "path": "/sign-up",
            },
          ],
          "element": <RouteWrapper
            Controller={[Function]}
          />,
          "path": "/",
        },
      ]
    `);
  });
});
