import { css } from 'emotion';
import React from 'react';
import { useForm } from 'vendor/tokamak';

import { LoginController } from './Login.controller';

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

export const LoginView = (ctrl: LoginController) => {
  const { values, Form } = useForm<LoginForm>({});

  if (ctrl.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <Form onSubmit={(values) => ctrl.login(values.username!, values.password!)}>
          <p>
            <label>Username</label>
          </p>
          <p>
            <Input type="text" placeholder="Username" name="username" validation={[IsRequired()]} />
          </p>
          <p>
            <label>Password</label>
          </p>
          <p>
            <Input
              type="password"
              placeholder="Password"
              name="password"
              validation={[IsRequired()]}
            />
          </p>
          <p>
            <button type="submit">Login</button>
          </p>
        </Form>
      </div>
    </div>
  );
};
