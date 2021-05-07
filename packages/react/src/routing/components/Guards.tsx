import { Guard } from '@tokamakjs/common';
import { ReactNode, useEffect, useState } from 'react';

function _useGuards(guards: Array<Guard>): { isLoading: boolean; shouldActivate: boolean } {
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

      guards.forEach((g) => (shouldActivate ? g.didActivate?.() : g.didNotActivate?.()));
    };

    _checkGuards();
  }, []);

  return state;
}

interface GuardsProps {
  guards: Array<Guard>;
  children: ReactNode;
}

export const Guards = ({ guards, children }: GuardsProps): any => {
  const { isLoading, shouldActivate } = _useGuards(guards);

  if (isLoading) {
    return null; // return LoadingView?
  }

  if (!shouldActivate) {
    return null;
  }

  return children;
};
