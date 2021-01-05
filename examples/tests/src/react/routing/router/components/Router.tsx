import { History } from 'history';
import React, { ReactNode, useRef, useState } from 'react';

import { LocationContext } from '../location-context';

interface RouterProps {
  history: History;
  children?: ReactNode;
}

export const Router = ({ children, history }: RouterProps) => {
  const [location, setLocation] = useState(history.location);

  // TODO: Play with history.block in guards
  useRef(
    history.listen(({ location }) => {
      setLocation(location);
    }),
  );

  return (
    <LocationContext.Provider value={{ history, location }}>{children}</LocationContext.Provider>
  );
};
