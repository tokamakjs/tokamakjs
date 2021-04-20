import { DiContainer } from '@tokamakjs/injection';
import { useContext } from 'react';

import { NoDiContainerFoundError } from '../errors';
import { DiContainerContext } from '../tokamak-app';

export function useDiContainer(): DiContainer {
  const container = useContext(DiContainerContext);

  if (container == null) {
    throw new NoDiContainerFoundError();
  }

  return container;
}
