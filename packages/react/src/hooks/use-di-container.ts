import { DiContainer } from '@tokamakjs/injection';
import { useContext } from 'react';

import { NoDiContainerFoundException } from '../exceptions';
import { DiContainerContext } from '../tokamak-app';

export function useDiContainer(): DiContainer {
  const container = useContext(DiContainerContext);

  if (container == null) {
    throw new NoDiContainerFoundException();
  }

  return container;
}
