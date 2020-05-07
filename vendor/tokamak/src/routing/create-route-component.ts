import { observer } from 'mobx-react';

import { View } from '../types';

export function createRouteComponent(view: View, controller: any, guards: any) {
  function RouteComponent({ canActivate }: any) {
    if (!canActivate.read()) {
      return 'Nope';
    }

    return view(controller);
  }

  Object.defineProperty(RouteComponent, 'name', { value: view.name });

  // @ts-ignore
  return observer(RouteComponent);
}
