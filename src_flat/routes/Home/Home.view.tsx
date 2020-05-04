import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserCard } from '../../modules/dashboard/components';
import { HomeController } from './Home.controller';

export const HomeView = (ctrl: HomeController) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (ctrl.currentUser == null) {
      navigate('/auth/login');
    }
  }, [ctrl.currentUser]);

  if (ctrl.currentUser == null) {
    return null;
  }

  return (
    <div>
      <h1>Home</h1>
      <h2>Welcome back</h2>
      <UserCard firstName={ctrl.currentUser.firstName} lastName={ctrl.currentUser.lastName} />
      <button onClick={() => ctrl.logout()}>Log out</button>
    </div>
  );
};
