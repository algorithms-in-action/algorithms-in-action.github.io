/* eslint-disable no-undef */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, fireEvent, cleanup, screen,
} from '@testing-library/react';
import App from './App';


test('Check if the input value is correct', () => {
  const utils = render(<Router><App /></Router>);
  const input = utils.getByTestId('searchInput');

  fireEvent.change(input, { target: { value: 'quick' } });
  expect(input.value).toBe('quick');
  expect(screen.getByText(/Quick Sort/i).textContent).toBe('Quick Sort');
});


describe('<App />', () => {
  afterEach(cleanup);
  it('dropdown box can work well', () => {
    const { getByText } = render(<Router><App /></Router>);
    // Click the button of 'Dynamic Programming' to unfold the dropdown list.
    fireEvent.click(getByText(/Sorting/));
    // Assert that KMP appear.
    expect(getByText(/Quick Sort/i)).toBeInTheDocument();
  });
});
