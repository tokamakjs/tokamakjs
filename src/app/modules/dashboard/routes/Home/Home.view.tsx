import React, { Fragment } from 'react';
import { Link } from 'vendor/tokamak';

import { UserCard } from '../../components';
import { HomeController } from './home.controller';

export const HomeView = (ctrl: HomeController) => {
  if (ctrl.isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Fragment>
      <h1>Home</h1>
      {ctrl.authToken != null ? <h2>Auth Token: {ctrl.authToken}</h2> : null}
      {ctrl.currentUser != null ? (
        <UserCard firstName={ctrl.currentUser.firstName} lastName={ctrl.currentUser.lastName} />
      ) : null}
      <ul>
        {ctrl.projects.map((project) => (
          <li key={project.name}>{project.name}</li>
        ))}
      </ul>
      <Link href="/auth/login">Login</Link>
      <p>
        <button onClick={() => ctrl.logout()}>Logout</button>
      </p>
    </Fragment>
  );
};
