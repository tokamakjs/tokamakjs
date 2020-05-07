import React, { ReactNode, createContext, useState } from 'react';

export const RouteTransitionContext = createContext({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

interface RouteTransitionProps {
  children: ReactNode;
  fallback: ReactNode;
}

export const RouteTransition = ({ children, fallback }: RouteTransitionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <RouteTransitionContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading ? fallback : children}
    </RouteTransitionContext.Provider>
  );
};
