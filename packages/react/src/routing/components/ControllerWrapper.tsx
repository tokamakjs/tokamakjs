import { Guard } from '@tokamakjs/common';
import { Class } from '@tokamakjs/injection';
import React, { createContext, useEffect, useState } from 'react';

import { useDiContainer, useResolveController } from '../../hooks';
import { DecoratedController } from '../../types';

export const ControllerContext = createContext<DecoratedController | undefined>(undefined);

function _useGuards(Guards: Array<Class<Guard>>): { isLoading: boolean; shouldActivate: boolean } {
  const container = useDiContainer();
  const guards = Guards.map((G) => container.resolveSync<Guard>(G));
  const [state, setState] = useState({ isLoading: true, shouldActivate: false });

  const guardsActivations = guards.map((g) => g.canActivate());

  // We can have conditional hooks here because this deals with
  // declarative code (in a decorator), so it's not something
  // the developer can manipulate programatically.
  //
  // This means, any modification to the order of these hooks would
  // come from a modification in the source code.

  // No promises
  if (guardsActivations.every((g) => g === true || g === false)) {
    const shouldActivate = guardsActivations.reduce((m: boolean, v) => m && (v as boolean), true);

    useEffect(() => {
      guards.forEach((g) => (shouldActivate ? g.didActivate?.() : g.didNotActivate?.()));
    }, [shouldActivate, ...guards]);

    return { isLoading: false, shouldActivate };
  }

  useEffect(() => {
    const _checkGuards = async () => {
      let shouldActivate = true;

      for (const activation of guardsActivations) {
        shouldActivate = shouldActivate && (await activation);
      }

      setState({ isLoading: false, shouldActivate });
      guards.forEach((g) => (state.shouldActivate ? g.didActivate?.() : g.didNotActivate?.()));
    };

    _checkGuards();
  }, []);

  return state;
}

interface ControllerWrapperProps<T> {
  Controller: Class<T>;
}

export const ControllerWrapper = <T extends any>({ Controller }: ControllerWrapperProps<T>) => {
  const ctrl = useResolveController(Controller);
  const { view: View, guards } = ctrl.__controller__;

  const { isLoading, shouldActivate } = _useGuards(guards ?? []);

  if (isLoading) {
    return null; // return LoadingView?
  }

  if (!shouldActivate) {
    return null;
    // throw new AuthError(); -> Support @Catch(AuthErrorFilter)
  }

  return (
    <ControllerContext.Provider value={ctrl}>
      <View />
    </ControllerContext.Provider>
  );
};
