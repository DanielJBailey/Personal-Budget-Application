import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import { render } from '@testing-library/react';
import Register from '../Register';

describe('<Register />', () => {
  let component;
  beforeEach(() => {
    component = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </MockedProvider>
    );
  });

  it('renders the register header', async () => {
    expect(component).toBeDefined();
    const header = await component.findAllByTestId('register-header');
    expect(header).toHaveLength(1);
  });

  it('renders the sign up form', async () => {
    const username = await component.findAllByTestId('username');
    const password = await component.findAllByTestId('password');
    const confirmation = await component.findAllByTestId('password-confirmation');
    expect(username).toHaveLength(1);
    expect(password).toHaveLength(1);
    expect(confirmation).toHaveLength(1);
  });

  it('renders the sign in link', async () => {
    const link = await component.findAllByTestId('login-link');
    expect(link).toHaveLength(1);
  });
});
