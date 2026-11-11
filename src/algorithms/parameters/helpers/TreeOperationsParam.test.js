/* eslint-env jest */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { GlobalContext } from '../../../context/GlobalState';
import { URLContext } from '../../../context/urlState';
import { TreeOperationsParam } from './TreeOperationsParam';

jest.mock('../../../context/GlobalState', () => ({
  GlobalContext: require('react').createContext(null),
}));
jest.mock('../../../context/actions', () => ({ GlobalActions: { RUN_ALGORITHM: 'run' } }));
jest.mock('../../../components/mid-panel/helper', () => ({ closeInstructions: jest.fn() }));

function mount(props = {}) {
  const dispatch = jest.fn();
  const setNodes = jest.fn();
  const view = render(
    <GlobalContext.Provider value={{ algorithm: {}, dispatch }}>
      <URLContext.Provider value={{ setNodes, setSearchValue: jest.fn() }}>
        <TreeOperationsParam name="AVLTree" list="3,?3,1,?9,2" {...props} />
      </URLContext.Provider>
    </GlobalContext.Provider>,
  );
  return { ...view, dispatch, setNodes };
}

test.each(['AVLTree', 'binarySearchTree', 'BSTrec'])('submits combined input for %s', name => {
  const { getByRole, dispatch } = mount({ name });
  dispatch.mockClear();
  fireEvent.submit(getByRole('textbox').closest('form'));
  expect(dispatch).toHaveBeenCalledWith('run', {
    name, mode: 'operations', operations: [
      { type: 'insert', value: 3 }, { type: 'search', value: 3 },
      { type: 'insert', value: 1 }, { type: 'search', value: 9 }, { type: 'insert', value: 2 },
    ],
  });
});

test.each(['Random', 'Sorted', 'Balanced'])('reorders and submits exactly once for %s', label => {
  const { getByRole, dispatch } = mount();
  dispatch.mockClear();
  fireEvent.click(getByRole('radio', { name: label }));
  expect(dispatch).toHaveBeenCalledTimes(1);
  const { operations } = dispatch.mock.calls[0][1];
  expect(operations).toHaveLength(5);
  expect(operations.filter(op => op.type === 'insert').map(op => op.value).sort()).toEqual([1, 2, 3]);
  if (label !== 'Random') {
    expect(operations.filter(op => op.type === 'search').map(op => op.value)).toEqual([3, 9]);
    expect(operations.filter(op => op.type === 'insert').map(op => op.value))
      .toEqual(label === 'Sorted' ? [1, 2, 3] : [2, 1, 3]);
  }
  expect(getByRole('radio', { name: label }).checked).toBe(true);
  fireEvent.change(getByRole('textbox'), { target: { value: '1,?1' } });
  expect(getByRole('radio', { name: label }).checked).toBe(false);
});

test('does not run or replace invalid input when reordering', () => {
  const { getByRole, getByText, dispatch } = mount();
  fireEvent.change(getByRole('textbox'), { target: { value: '1,?,2' } });
  dispatch.mockClear();
  fireEvent.click(getByRole('radio', { name: 'Balanced' }));
  expect(getByRole('textbox').value).toBe('1,?,2');
  expect(getByText(/Invalid input/)).toBeTruthy();
  expect(dispatch).not.toHaveBeenCalled();
  fireEvent.submit(getByRole('textbox').closest('form'));
  expect(dispatch).not.toHaveBeenCalled();
});

test('loads a legacy search URL as inserts followed by a search', () => {
  const { getByRole, dispatch } = mount({ list: '0,-2', mode: 'search', value: '-2' });
  expect(getByRole('textbox').value).toBe('0,-2,?-2');
  expect(dispatch.mock.calls[0][1].operations).toEqual([
    { type: 'insert', value: 0 }, { type: 'insert', value: -2 }, { type: 'search', value: -2 },
  ]);
});

test('generates and runs a mixed example when refreshed', () => {
  const { getByRole, dispatch } = mount();
  fireEvent.click(getByRole('radio', { name: 'Sorted' }));
  dispatch.mockClear();
  fireEvent.click(getByRole('button', { name: 'Generate random input' }));
  expect(dispatch).toHaveBeenCalledTimes(1);
  const { operations } = dispatch.mock.calls[0][1];
  expect(operations.filter(operation => operation.type === 'insert')).toHaveLength(12);
  expect(operations.filter(operation => operation.type === 'search')).toHaveLength(3);
  expect(getByRole('radio', { name: 'Sorted' }).checked).toBe(false);
});
