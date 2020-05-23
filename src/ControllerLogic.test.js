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
  it('Context value is updated by child component', () => {
    const { getByText } = render(<App />);
    expect(getByText(/In computer science/i).textContent).toBe('In computer science, binary search trees (BST), sometimes called ordered or sorted binary trees, are a particular type of container: a data structure that stores "items" (such as numbers, names etc.) in memory. They allow fast lookup, addition and removal of items, and can be used to implement either dynamic sets of items, or lookup tables that allow finding an item by its key (e.g., finding the phone number of a person by name). Binary search trees keep their keys in sorted order, so that lookup and other operations can use the principle of binary search: when looking for a key in a tree (or a place to insert a new key), they traverse the tree from root to leaf, making comparisons to keys stored in the nodes of the tree and deciding, on the basis of the comparison, to continue searching in the left or right subtrees. On average, this means that each comparison allows the operations to skip about half of the tree, so that each lookup, insertion or deletion takes time proportional to the logarithm of the number of items stored in the tree. This is much better than the linear time required to find items by key in an (unsorted) array, but slower than the corresponding operations on hash tables. Several variants of the binary search tree have been studied in computer science; this article deals primarily with the basic type, making references to more advanced types when appropriate. In computer science, binary search trees (BST), sometimes called ordered or sorted binary trees, are a particular type of container: a data structure that stores "items" (such as numbers, names etc.) in memory. They allow fast lookup, addition and removal of items, and can be used to implement either dynamic sets of items, or lookup tables that allow finding an item by its key (e.g., finding the phone number of a person by name). Binary search trees keep their keys in sorted order, so that lookup and other operations can use the principle of binary search: when looking for a key in a tree (or a place to insert a new key), they traverse the tree from root to leaf, making comparisons to keys stored in the nodes of the tree and deciding, on the basis of the comparison, to continue searching in the left or right subtrees. On average, this means that each comparison allows the operations to skip about half of the tree, so that each lookup, insertion or deletion takes time proportional to the logarithm of the number of items stored in the tree. This is much better than the linear time required to find items by key in an (unsorted) array, but slower than the corresponding operations on hash tables. Several variants of the binary search tree have been studied in computer science; this article deals primarily with the basic type, making references to more advanced types when appropriate.this is explanation');
    fireEvent.click(getByText('Quick Sort'));
    expect(getByText(/this is explanation/i).textContent).toBe('Quick Sort.this is explanation');
  });
});

describe('<App />', () => {
  afterEach(cleanup);
  it('dropdown box can work well', () => {
    const { getByText } = render(<App />);
    // Assert that KMP does not appear.
    const Kmp = screen.queryByText('Knutt-Morris-Pratt');
    expect(Kmp).toBeNull();
    // Click the button of 'Dynamic Programming' to unfold the dropdown list.
    fireEvent.click(getByText(/Dynamic Programming/));
    // Assert that KMP appear.
    expect(getByText(/Knutt-Morris-Pratt/i)).toBeInTheDocument();
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
