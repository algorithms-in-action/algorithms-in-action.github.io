import React, { createContext, useReducer } from 'react';
import reducer, { init } from './AppReducer';

// This algorithm will be loaded when the app begins
const DEFAULT_ALGORITHM = 'binaryTreeSearch';

// Create context
export const GlobalContext = createContext();

// Provider components
// eslint-disable-next-line react/prop-types
export const GlobalProvider = ({ children }) => {
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useReducer(reducer, DEFAULT_ALGORITHM, init);

  return (
    <GlobalContext.Provider value={{ algorithm: state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
