import { delay, useForm, z, ze } from '@tokamakjs/common';
import { Controller, SubApp, TokamakApp, createRoute, useController } from '@tokamakjs/react';
import React from 'react';

const SignUpFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirmation: z.string(),
});

interface SignUpData {
  email: string;
  password: string;
}

export const TestViewA = () => {
  const ctrl = useController<TestControllerA>();
  const form = useForm(SignUpFormSchema, {
    defaults: { email: 'sample@email.com', password: 'asdf1234' },
    autoValidate: false, // validates on change
  });
  const isLoading = false;

  return (
    <div>
      <h1>Sign Up</h1>
      {isLoading ? (
        'Loading...'
      ) : (
        <form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              const values = form.validate();

              if (values.password !== values.passwordConfirmation) {
                form.errors.set('passwordConfirmation', 'Different password');
                return;
              }

              ctrl.signUp(values);
            } catch (e) {
              console.log(form.errors.all());
            }
          }}>
          <p>
            <label htmlFor="email">Email</label>
          </p>
          <p>
            <input
              type="text"
              name="email"
              value={form.get('email')}
              onChange={(e) => form.set('email', e.target.value)}
              onBlur={(e) => form.check('email')}
              onFocus={(e) => form.errors.set('email', undefined)}
            />
          </p>
          {form.errors.get('email') != null ? (
            <div>
              <small>{form.errors.get('email')}</small>
            </div>
          ) : null}
          <p>
            <label htmlFor="password">Password</label>
          </p>
          <p>
            <input
              type="password"
              name="password"
              value={form.get('password')}
              onChange={(e) => form.set('password', e.target.value)}
            />
          </p>
          {form.errors.get('password') != null ? (
            <div>
              <small>{form.errors.get('password')}</small>
            </div>
          ) : null}
          <p>
            <label htmlFor="passwordConfirmation">Password confirmation</label>
          </p>
          <p>
            <input
              type="password"
              name="passwordConfirmation"
              value={form.get('passwordConfirmation')}
              onChange={(e) => form.set('passwordConfirmation', e.target.value)}
            />
          </p>
          {form.errors.get('passwordConfirmation') != null ? (
            <div>
              <small>{form.errors.get('passwordConfirmation')}</small>
            </div>
          ) : null}
          <p>
            <button type="submit">Sign Up</button>
          </p>
          <p>
            <button type="button" onClick={() => form.reset()}>
              Reset
            </button>
          </p>
          <p>
            <button type="button" onClick={() => form.clear()}>
              Clear
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

@Controller({ view: TestViewA })
export class TestControllerA {
  public async signUp(data: SignUpData): Promise<void> {
    await delay(1000);
    console.log(data);
  }
}

@SubApp({
  providers: [],
  routing: [createRoute('/', TestControllerA)],
  imports: [],
})
export class TestModule {}

async function test() {
  const app = await TokamakApp.create(TestModule);
  app.render('#root');
}

test();
