import { observer } from 'mobx-react';
import { useEffect } from 'react';

import { hasOnDidMount, hasOnDidRender, hasOnDidUnmount } from '../interfaces';
import { View } from '../types';
import { Readable } from './wrap-promise';

interface RouteComponentProps {
  canActivate: Readable<boolean>;
}

export function createRouteComponent(view: View, controller: any) {
  function RouteComponent({ canActivate }: RouteComponentProps) {
    useEffect(() => {
      if (hasOnDidMount(controller)) {
        controller.onDidMount();
      }

      return () => {
        if (hasOnDidUnmount(controller)) {
          controller.onDidUnmount();
        }
      };
    }, []);

    useEffect(() => {
      if (hasOnDidRender(controller)) {
        controller.onDidRender();
      }
    });

    if (!canActivate.read()) {
      return null;
    }

    return view(controller);
  }

  Object.defineProperty(RouteComponent, 'name', { value: view.name });

  // @ts-ignore
  return observer(RouteComponent);
}
