import { History } from 'history';
import React, { ReactNode, useEffect, useState } from 'react';

import { LocationContext } from '../location-context';

interface RouterProps {
  history: History;
  children?: ReactNode;
}

export const Router = ({ children, history }: RouterProps) => {
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    // TODO: Idea, maybe using history.block instead of Suspense (or as an alternative)
    // for guards.

    const stop = history.listen(({ location }) => {
      setLocation(location);
    });

    return stop;
  });

  return (
    <LocationContext.Provider value={{ history, location }}>{children}</LocationContext.Provider>
  );
};
