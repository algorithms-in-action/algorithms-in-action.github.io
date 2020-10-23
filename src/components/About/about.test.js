/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Router from '../../router/Router';

test('full app rendering', () => {
  const history = createMemoryHistory();
  render(<BrowserRouter history={history}><Router /></BrowserRouter>);

  // verify page content for '/' route, i.e. rendering <App /> component
  // should see 'Sorting' on the left panel and 'Binary Search Tree' as default algorithm
  expect(screen.getByText(/Sorting/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Binary Search Tree/i)[0]).toBeInTheDocument();

  // simulate click the 'About' button link to the About page
  const leftClick = { button: 0 };
  userEvent.click(screen.getByText(/About/i), leftClick);
  // check that the content changed to the about page
  expect(screen.getByText(/Algorithms in Action/i)).toBeInTheDocument();
  expect(screen.getByText(/Core Team/i)).toBeInTheDocument();
});
