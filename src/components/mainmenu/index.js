import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // add this line
import '../../styles/mainmenu.scss';
import logo from '../../assets/logo.svg';
import SortingAlgorithms from './SortingAlgorithms';
import InsertSearchAlgorithms from './InsertSearchAlgorithms';
import GraphAlgorithms from './GraphAlgorithms';
import SetAlgorithms from './SetAlgorithms';
import StringSearchAlgorithms from './StringSearchAlgorithms';

// Only pull algorithms that have property noDeploy set to false
import { DeployedAlgorithms } from '../../algorithms';

// Get the base URL dynamically
const baseUrl = window.location.origin;

/* eslint-disable react/prop-types */
// Stub to create the HTML for each category container
// this will be used to dynamically create a category container
// in the main menu for each unique category present in the master list.
const CategorySection = ({ category, items }) => (
  <div className="category-container">
    <h2 className="category">{category}</h2>
    {items.map(({ name, url }) => (
      <a key={url} href={url} className="mainmenu-algo-link">
        {name}
      </a>
    ))}
  </div>
);

// Array of objects linking name to url
const nameToUrl = DeployedAlgorithms.flatMap(({ algorithms }) =>
  algorithms.map(({ name, shorthand, mode }) => ({
    name,
    url: `${baseUrl}/?alg=${shorthand}&mode=${mode}`,
  }))
);

const Mainmenu = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

    const filteredAlgorithms = nameToUrl.filter(algorithm =>
    algorithm.name.toLowerCase().includes(searchTerm.toLowerCase())
    // XXX nice to add keyword search also
    // TODO: ask for clarification from client, just the functionality
    // to do so or do we also need to come up with the keywords ourselves?
  );
  return (
    <div className="mainmenu-container">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">
          <span className="algorithm">Algorithms</span>
          <span className="in-action">In Action</span>
        </h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for algorithm"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          {searchTerm && (
            <div className="search-results">
              {filteredAlgorithms.length > 0 ? (
                filteredAlgorithms.map((algorithm, index) => (
                  <a key={index} href={algorithm.url} className="search-result-link">
                    {algorithm.name}
                  </a>
                ))
              ) : (
                <p>No results found</p>
              )}
            </div>
          )}
        </div>
        <Link to="/about" className="about-link">About</Link>
      </div>
      <div className="main-content">
        <SortingAlgorithms />
        <SetAlgorithms />
        <InsertSearchAlgorithms />
        <StringSearchAlgorithms />
	<GraphAlgorithms />
	</div>
    </div>
  );
};

export default Mainmenu;
