import React from 'react';
import { Link } from 'react-router-dom';

export const AboutView = () => {
  return (
    <div>
      <p>About</p>
      <Link to="/">Go back to home</Link>
    </div>
  );
};
