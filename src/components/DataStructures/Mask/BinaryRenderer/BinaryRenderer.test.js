/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import BinaryRenderer from './index';

describe('BinaryRenderer', () => {
  it('accepts emphasise without a prop-type warning', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<BinaryRenderer header="Binary" data={5} maxBits={4} highlight={[0]} emphasise />);
    expect(screen.getByText('Binary')).toBeInTheDocument();
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
