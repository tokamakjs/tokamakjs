import React, { useEffect } from 'react';

import { UserCard } from '../../components';
import { HomeController } from './Home.controller';

export const HomeView = (ctrl: HomeController) => {
  useEffect(() => {
    ctrl.loadProjects();
  });

  if (ctrl.currentUser == null) {
    return null;
  }

  return (
    <div>
      <h1>Home</h1>
      <h2>Welcome back</h2>
      <UserCard firstName={ctrl.currentUser.firstName} lastName={ctrl.currentUser.lastName} />
      {ctrl.isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {ctrl.projects.map((project) => {
            <li>{project.name}</li>;
          })}
        </ul>
      )}
      <button onClick={() => ctrl.logout()}>Log out</button>
    </div>
  );
};
