/* eslint-disable no-undef */
import React from 'react';
import {
  render, fireEvent, cleanup, screen,
} from '@testing-library/react';
import App from './App';


test('Check if the input value is correct', () => {
  const utils = render(<App />);
  const input = utils.getByTestId('search-input').firstChild;
  fireEvent.change(input, { target: { value: 'quick' } });
  expect(input.value).toBe('quick');
  expect(screen.getByText(/Quick Sort/i).textContent).toBe('Quick Sort');
});


describe('<App />', () => {
  afterEach(cleanup);
  it('dropdown box can work well', () => {
    const { getByText } = render(<App />);
    // Assert that KMP does not appear.
    const Kmp = screen.queryByText('Knuth-Morris-Pratt');
    expect(Kmp).toBeNull();
    // Click the button of 'Dynamic Programming' to unfold the dropdown list.
    fireEvent.click(getByText(/Dynamic Programming/));
    // Assert that KMP appear.
    expect(getByText(/Knuth-Morris-Pratt/i)).toBeInTheDocument();
  });
});
