import { DiContainer } from '@tokamakjs/injection';
import { useContext } from 'react';

import { DiContainerContext } from '../components';
import { NoDiContainerFoundError } from '../errors';

export function useDiContainer(): DiContainer {
  const container = useContext(DiContainerContext);

  if (container == null) {
    throw new NoDiContainerFoundError();
  }

  return container;
}
