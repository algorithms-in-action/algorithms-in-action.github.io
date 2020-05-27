import React, { createContext, useState } from 'react';
import { dispatcher, initialState } from './actions';

/* What's going on here?
 * We maintain a global state to hold info about the currently executing algorithm.
 *
 * The GlobalContext is an object that can be referenced by any component that needs
 * access to the global state. They can then modify that state by calling the dispatch
 * function with a particular action and any extra information the action needs.
 *
 * The magic is that when the state is changed, React re-renders components so we can
 * see the new state reflected on screen.
 */

// Create context
export const GlobalContext = createContext();

// Provider components
// eslint-disable-next-line react/prop-types
export const GlobalProvider = ({ children }) => {
  const [state, setState] = useState(initialState());
  // Think of this as partial function application to get state & setState in scope
  // for later calls from elsewhere in the app.
  const dispatch = dispatcher(state, setState);

  return (
    <GlobalContext.Provider value={{ algorithm: state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
