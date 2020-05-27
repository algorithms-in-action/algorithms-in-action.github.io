/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';
import {
  render, fireEvent, cleanup, screen,
} from '@testing-library/react';
import App from './App';
import Header from './components/Header';

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

// To test the header should render a top level div.
describe('<Header />', () => {
  it('should render a top level div', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Header />);
    const result = renderer.getRenderOutput();
    expect(result.type).toBe('div');
  });
  it('should render 2 button', () => {
    const testRenderer = TestRenderer.create(<Header />);
    const testInstance = testRenderer.root;
    expect(testInstance.findAll((node) => node.type === 'button')).toHaveLength(2);
  });
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
