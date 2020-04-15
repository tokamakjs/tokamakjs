import { createRoute } from '../routing';

describe('createRoute', () => {
  class Route {}

  it('should create a valid route', () => {
    const result = createRoute('/path', Route);
    expect(result).toMatchObject({
      path: '/path',
      Route,
      children: [],
    });
  });
});

describe('includeRoutes', () => {});
