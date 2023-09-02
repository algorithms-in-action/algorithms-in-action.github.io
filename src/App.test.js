// Most baseline test: does the app actually render?

import React from 'react';
import { render } from '@testing-library/react';

import App from './App';

test('renders app', () => {
  render(<App />);
});
