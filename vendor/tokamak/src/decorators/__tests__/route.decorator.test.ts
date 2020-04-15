import { RouteMetadata, route } from '../route.decorator';

describe('@route', () => {
  const RouteView = () => null;
  class RouteController {}

  @route({
    view: RouteView,
    controller: RouteController,
  })
  class Route {}

  it('should add route metadata to the class', () => {
    const view = Reflect.getMetadata<RouteMetadata, 'view'>('view', Route);
    const controller = Reflect.getMetadata<RouteMetadata, 'controller'>('controller', Route);

    expect(view).toBe(RouteView);
    expect(controller).toBe(RouteController);
  });
});
