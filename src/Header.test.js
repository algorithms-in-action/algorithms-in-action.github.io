/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';
// import GlobalState from './context/GlobalState';
import App from './App';
import Header from './components/Header';

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
