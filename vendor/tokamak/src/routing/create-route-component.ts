import { observer } from 'mobx-react';
import { useEffect } from 'react';

import { hasOnDidMount, hasOnDidRender, hasOnDidUnmount } from '../interfaces';
import { View } from '../types';
import { useMountLifeCycle, useRenderLifeCycle } from './life-cycle-hooks';
import { Readable } from './wrap-promise';

interface RouteComponentProps {
  canActivate: Readable<boolean>;
}

export function createRouteComponent(view: View, controller: any) {
  function RouteComponent({ canActivate }: RouteComponentProps) {
    useMountLifeCycle(controller);
    useRenderLifeCycle(controller);

    if (!canActivate.read()) {
      return null;
    }

    try {
      return view(controller);
    } catch {
      return 'Error';
    }
  }

  Object.defineProperty(RouteComponent, 'name', { value: view.name });

  // @ts-ignore
  return observer(RouteComponent);
}
