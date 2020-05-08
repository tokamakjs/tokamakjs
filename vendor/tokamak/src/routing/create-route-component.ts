import { observer } from 'mobx-react';

import { View } from '../types';
import { Readable } from './wrap-promise';

interface RouteComponentProps {
  canActivate: Readable<boolean>;
}

export function createRouteComponent(view: View, controller: any) {
  function RouteComponent({ canActivate }: RouteComponentProps) {
    if (!canActivate.read()) {
      return null;
    }

    return view(controller);
  }

  Object.defineProperty(RouteComponent, 'name', { value: view.name });

  // @ts-ignore
  return observer(RouteComponent);
}
