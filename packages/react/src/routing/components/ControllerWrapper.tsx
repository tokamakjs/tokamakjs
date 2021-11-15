import { Class } from '@tokamakjs/injection';
import React, { createContext } from 'react';

import { useResolveController } from '../../hooks';
import { DecoratedController } from '../../types';

export const ControllerContext = createContext<DecoratedController | undefined>(undefined);

interface ControllerWrapperProps<T> {
  Controller: Class<T>;
}

export const ControllerWrapper = <T extends any>({ Controller }: ControllerWrapperProps<T>) => {
  const ctrl = useResolveController(Controller);
  const { view: View } = ctrl.__controller__;

  return (
    <ControllerContext.Provider value={ctrl}>
      <View />
    </ControllerContext.Provider>
  );
};
