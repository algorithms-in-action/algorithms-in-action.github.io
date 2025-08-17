import React, { useState } from "react";
import "../styles/AlgorithmMenu.scss";

// Get the base URL dynamically
const baseUrl = window.location.origin;
  
import { DeployedAlgorithms } from '../algorithms/masterList';

// Dynamically create URLs in algorithm menu from master list (src/algorithms/index.js).
// Only entries with noDeploy=false are included.
const algorithms = Object.fromEntries(
  DeployedAlgorithms.map(({ category, algorithms }) => [
    category,
    Object.fromEntries(
      algorithms.map(({ name, shorthand, mode }) => [
        name,
        `${baseUrl}/?alg=${shorthand}&mode=${mode}`,
      ]),
    ),
  ]),
);

function AlgorithmMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="algorithm-menu">
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && (
        <div className="dropdown">
          {Object.entries(algorithms).map(([category, algs]) => (
            <div
              key={category}
              className="category"
              onMouseEnter={() => setActiveCategory(category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {category}
              {activeCategory === category && (
                <div className="subcategory">
                  {Object.entries(algs).map(([alg, url]) => (
                    <a key={alg} href={url || "#"}>
                      {alg}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlgorithmMenu;
