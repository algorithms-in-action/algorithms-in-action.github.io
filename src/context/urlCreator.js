import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

// Create a new context specifically for values needed for the url
export const URLContext = createContext();

// Provider component for values needed
export const URLProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [searchValue, setSearchValue] = useState([]);

  const value = {
    nodes,
    setNodes,
    searchValue,
    setSearchValue,
  };

  return (
    <URLContext.Provider value={value}>
      {children}
    </URLContext.Provider>
  );
};

// Add prop-types to validate children
URLProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
