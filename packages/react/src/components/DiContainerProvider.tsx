import { DiContainer } from '@tokamakjs/injection';
import React, { ReactNode, createContext } from 'react';

export const DiContainerContext = createContext<DiContainer | undefined>(undefined);

interface DiContainerProviderProps {
  value: DiContainer;
  children: ReactNode;
}

export const DiContainerProvider = ({ value, children }: DiContainerProviderProps) => {
  return <DiContainerContext.Provider value={value}>{children}</DiContainerContext.Provider>;
};
