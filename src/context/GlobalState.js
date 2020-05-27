import React, { createContext, useReducer } from 'react';
import reducer from './AppReducer';

// Initial State
const initialState = {
  name: 'Binary Search Trees',
  text: '# This is a sample of markdown\n'
        + '## Title\n'
        + '* 1\n'
        + '* 2\n'
        + '* 3\n\n'
        + '<blockquote> blockquote </blockquote>\n'
        + '\nYou can also combine them with html keywords.\n'
        + '<blockquote> For exmaple, <strong> strong blockquote</strong>. </blockquote>\n',
};


// Create context
export const GlobalContext = createContext();

// Provider components
// eslint-disable-next-line react/prop-types
export const GlobalProvider = ({ children }) => {
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ algorithm: state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
