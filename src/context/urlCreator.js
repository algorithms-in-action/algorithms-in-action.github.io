import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

// Create a new context specifically for values needed for the url
export const URLContext = createContext();

// Provider component for values needed
export const URLProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [graphSize, setGraphSize] = useState([]);
  const [graphStart, setGraphStart] = useState([]);
  const [graphEnd, setGraphEnd] = useState([]);
  const [heuristic, setHeuristic] = useState([]);
  const value = {
    nodes, setNodes,
    searchValue, setSearchValue,
    graphSize, setGraphSize,
    graphStart, setGraphStart,
    graphEnd, setGraphEnd,
    heuristic, setHeuristic,
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
