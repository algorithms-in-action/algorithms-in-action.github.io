import React, { useState } from 'react';
import { DeployedAlgorithmCategoryList } from '../algorithms/masterList';
import '../styles/AlgorithmMenu.scss';

const baseUrl = window.location.origin;

function AlgorithmMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="algorithm-menu" onMouseLeave={() => setIsOpen(false)}>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && (
        <div className="dropdown">
          {DeployedAlgorithmCategoryList.map(({ category, algorithms }) => (
            <div
              key={category}
              className="category"
              onMouseEnter={() => setActiveCategory(category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {category}
              {activeCategory === category && (
                <div className="subcategory">
                  {algorithms.map(({ name, shorthand, mode }) => (
                    <a
                      key={shorthand}
                      href={`${baseUrl}/?alg=${shorthand}&mode=${mode}`}
                    >
                      {name}
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
