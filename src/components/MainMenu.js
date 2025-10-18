import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // add this line
import '../styles/mainmenu.scss';
import logo from '../assets/logo.svg';

// Only pull algorithms that have property noDeploy set to false
import { DeployedAlgorithmCategoryList } from '../algorithms/masterList';

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
const nameToInfo = DeployedAlgorithmCategoryList.flatMap(({ algorithms }) =>
  algorithms.map(({ name, shorthand, mode, keywords}) => ({
    name,
    url: `${baseUrl}/?alg=${shorthand}&mode=${mode}`,
    // Keywords may be undefined in master list
    keywords : (keywords ?? []).map((keyword) => keyword.toLowerCase()),
  }))
);

const Mainmenu = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const query = searchTerm.toLowerCase();

  const filteredAlgorithms = nameToInfo.filter(({ name, keywords }) =>
    name.toLowerCase().includes(query) || 
    keywords.some((keyword => keyword.includes(query)))
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
        {DeployedAlgorithmCategoryList.map(({ category, algorithms }) => (
            <CategorySection
                key={`${category}-wrapper`}
                category={category}
                items={algorithms.map(({ name, shorthand, mode }) => ({
                    name,
                    url: `${baseUrl}/?alg=${shorthand}&mode=${mode}`,
                }))}
            />
        ))}
      </div>
    </div>
  );
};

export default Mainmenu;
