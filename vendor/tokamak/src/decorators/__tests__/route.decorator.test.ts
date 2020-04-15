import { Reflector } from '../../reflection';
import { route } from '../route.decorator';

describe('@route', () => {
  const RouteView = () => null;
  class RouteController {}

  @route({
    view: RouteView,
    controller: RouteController,
  })
  class Route {}

  it('should add route metadata to the class', () => {
    const { view, controller } = Reflector.getRouteMetadata(Route);

    expect(view).toBe(RouteView);
    expect(controller).toBe(RouteController);
  });
});
