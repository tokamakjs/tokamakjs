import { css } from 'emotion';
import React from 'react';

const styles = {
  login: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  container: css`
    width: 300px;
    border: 1px solid silver;
    border-radius: 3px;
    padding: 16px;
    margin-top: 20%;

    input {
      width: 100%;
      display: block;
    }
  `,
};

export const LoginView = () => {
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <form>
          <p>
            <label>Username</label>
          </p>
          <p>
            <input type="text" placeholder="Username" />
          </p>
          <p>
            <label>Password</label>
          </p>
          <p>
            <input type="password" placeholder="Password" />
          </p>
          <p>
            <button>Login</button>
          </p>
        </form>
      </div>
    </div>
  );
};
