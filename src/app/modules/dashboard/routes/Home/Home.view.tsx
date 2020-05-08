import React from 'react';

import { UserCard } from '../../components';
import { HomeController } from './Home.controller';

export const HomeView = (ctrl: HomeController) => {
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
