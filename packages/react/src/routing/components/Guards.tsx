import { Guard } from '@tokamakjs/common';
import { ReactNode, useEffect, useState } from 'react';

import { useGlobalErrorsManager } from '../../hooks';

function _useGuards(guards: Array<Guard>): { isLoading: boolean; shouldActivate: boolean } {
  const [state, setState] = useState({ isLoading: true, shouldActivate: false });
  const globalErrorsManager = useGlobalErrorsManager();

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
      // delay the callback hooks so navigate() doesn't complain
      setTimeout(() => {
        try {
          guards.forEach((g) => (shouldActivate ? g.didActivate?.() : g.didNotActivate?.()));
        } catch (err) {
          // manually re-throw these errors using the globalErrorsManager
          // since they're not correctly picked up by window.onerror
          globalErrorsManager.throw(err);
        }
      });
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

      try {
        guards.forEach((g) => (shouldActivate ? g.didActivate?.() : g.didNotActivate?.()));
      } catch (err) {
        // manually re-throw these errors using the globalErrorsManager
        // since they're not correctly picked up by window.onerror
        globalErrorsManager.throw(err);
      }
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
