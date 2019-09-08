import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import { render } from '@testing-library/react';
import Login from '../Login';

describe('<Login />', () => {
  let component;
  beforeEach(() => {
    component = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </MockedProvider>
    );
  });

  it('renders the signin header', async () => {
    expect(component).toBeDefined();
    const header = await component.findAllByTestId('sign-in-header');
    expect(header).toHaveLength(1);
  });

  it('renders the log in form', async () => {
    const username = await component.findAllByTestId('username');
    const password = await component.findAllByTestId('password');
    expect(username).toHaveLength(1);
    expect(password).toHaveLength(1);
  });

  it('renders the sign up link', async () => {
    const link = await component.findAllByTestId('sign-up-link');
    expect(link).toHaveLength(1);
  });
});
