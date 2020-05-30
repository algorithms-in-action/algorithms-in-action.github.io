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


test('Check if the input value is correct', () => {
  const utils = render(<App />);
  const input = utils.getByTestId('search-input').firstChild;
  fireEvent.change(input, { target: { value: 'quick' } });
  expect(input.value).toBe('quick');
  expect(screen.getByText(/Quick Sort/i).textContent).toBe('Quick Sort');
});


describe('<App />', () => {
  afterEach(cleanup);
  it('Context value is updated by child component', () => {
    const { getByText } = render(<App />);
    // initial data in the explanation panel.
    expect(getByText(/A binary search tree/i).textContent).toBe(' A binary search tree (bst) is a basic tree data structure that supports a simple searching algorithm. For each node in the binary search tree, with key k, all nodes in its left subtree have keys smaller than k, while all nodes in its right subtree have keys larger than k. Where duplicate keys are allowed in the tree, they usually go into the right subtree by convention. ');
    // click the button of "Quick Sort".
    fireEvent.click(getByText('Quick Sort'));
    // Data changed in the explanation panel.
    expect(getByText(/A Quick Sort/i).textContent).toBe('A Quick Sort works by sorting quickly.');
  });
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
