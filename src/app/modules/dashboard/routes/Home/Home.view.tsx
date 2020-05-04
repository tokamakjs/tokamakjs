import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <h2>Welcome back:</h2>
      <ul>
        <li>First Name: {ctrl.currentUser.firstName}</li>
        <li>Last Name: {ctrl.currentUser.lastName}</li>
      </ul>
      <button onClick={() => ctrl.logout()}>Log out</button>
    </div>
  );
};
