import { Guard } from '@tokamakjs/common';
import { ReactNode, useEffect, useState } from 'react';

import { useGlobalErrorsManager } from '../../hooks';

function _useGuards(guards: Array<Guard>): { isLoading: boolean; shouldActivate: boolean } {
  console.log('Guards::_useGuards');
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
    console.log('Guards::_useGuards', '(check if can activate, no promises)');

    const shouldActivate = guardsActivations.reduce((m: boolean, v) => m && (v as boolean), true);

    useEffect(() => {
      console.log('Guards::_useGuards', '(guards callbacks)');
      guards.forEach((g) => (shouldActivate ? g.didActivate?.() : g.didNotActivate?.()));
    }, [shouldActivate, ...guards]);

    return { isLoading: false, shouldActivate };
  }

  useEffect(() => {
    const _checkGuards = async () => {
      console.log('Guards::_useGuards', '(check if can activate, with promises)');
      let shouldActivate = true;

      for (const activation of guardsActivations) {
        shouldActivate = shouldActivate && (await activation);
      }

      console.log('Guards::_useGuards', '(set state)');
      setState({ isLoading: false, shouldActivate });

      console.log('Guards::_useGuards', '(guards callbacks)');
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
  console.log('Guards::render');
  const { isLoading, shouldActivate } = _useGuards(guards);

  if (isLoading) {
    console.log('Guards::render', '(is loading)');
    return null; // return LoadingView?
  }

  if (!shouldActivate) {
    console.log('Guards::render', '(cannot activate, renders null (no view))');
    return null;
  }

  console.log('Guards::render', '(render normally (View::render))');

  return children;
};
