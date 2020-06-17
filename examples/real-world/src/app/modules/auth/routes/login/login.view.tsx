import React from 'react';

import { useLoginFacade } from './login.facade';

export const LoginView = () => {
  const fcd = useLoginFacade();
  return (
    <div>
      Login
      <p>
        <button onClick={() => fcd.login()}>Login</button>
      </p>
    </div>
  );
};
