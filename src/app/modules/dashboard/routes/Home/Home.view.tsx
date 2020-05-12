import React, { useEffect } from 'react';

import { UserCard } from '../../components';
import { HomeController } from './Home.controller';

export const HomeViewLoading = () => {
  return <div>Loading...</div>;
};

export const HomeViewError = () => {
  return <div>There was an error trying to render.</div>;
};

export const HomeView = (ctrl: HomeController) => {
  if (ctrl.currentUser == null) {
    return null;
  }

  return (
    <div>
      <h1>Home</h1>
      <h2>Welcome back</h2>
      <UserCard firstName={ctrl.currentUser.firstName} lastName={ctrl.currentUser.lastName} />
      {ctrl.isLoadingProjects ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {ctrl.projects.map((project) => (
            <li key={project.name}>{project.name}</li>
          ))}
        </ul>
      )}
      <button onClick={() => ctrl.logout()}>Log out</button>
    </div>
  );
};
