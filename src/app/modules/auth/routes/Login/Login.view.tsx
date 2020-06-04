import { css } from 'emotion';
import React from 'react';
import { Link, useForm } from 'vendor/tokamak';

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

interface LoginForm {
  username?: string;
  password?: string;
}

export const LoginView = () => {
  const loginForm = useForm<LoginForm>({});

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <p>
          <label>Username</label>
        </p>
        <p>
          <input
            type="text"
            placeholder="Username"
            value={loginForm.get('username')}
            onChange={(e) => loginForm.set(e.target.value, 'username')}
          />
        </p>
        <p>
          <label>Password</label>
        </p>
        <p>
          <input
            type="password"
            placeholder="Password"
            value={loginForm.get('password')}
            onChange={(e) => loginForm.set(e.target.value, 'password')}
          />
        </p>
        <p>
          <button>Login</button>
        </p>
        <p>
          <Link href="/">Home</Link>
        </p>
      </div>
    </div>
  );
};
