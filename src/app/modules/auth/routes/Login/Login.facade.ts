import { useEffect, useState } from 'react';
import { useQuery, useService } from 'vendor/tokamak';

import { AuthGuard } from '../../guards';
import { AuthQuery, AuthService } from '../../stores';

interface LoginFacade {
  token?: string;
  login: (username: string, password: string) => void;
}

export function useLoginFacade(): LoginFacade {
  useAuth();

  const authService = useService(AuthService);
  const authQuery = useQuery(AuthQuery);

  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    authQuery.authToken$.subscribe((authToken) => setToken(authToken));
  }, []);

  return {
    token,
    login: (username, password) => {
      authService.login(username, password);
    },
  };
}
