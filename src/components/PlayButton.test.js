/* eslint-disable no-undef */
import React, { useContext } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { GlobalContext } from '../context/GlobalState';
import PlayButton, { sleep } from './PlayButton';
import App from '../App';

test('PlayButton execution', () => {
  const { getByText } = render(<App />);
  fireEvent.click(getByText(/Play/));
  sleep(10000).then(() => {
    const { algorithm } = useContext(GlobalContext);
    expect(algorithm.finished).toEqual(true);
  });
});

test('Execution speed change', () => {
  const { getByPlaceholderText } = render(<App />);
  const slider = getByPlaceholderText('slider');
  fireEvent.change(slider);
  const { speed } = PlayButton;
  expect(speed).toEqual(slider.value);
});
