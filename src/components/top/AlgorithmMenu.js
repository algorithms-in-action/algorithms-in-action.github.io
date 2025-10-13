import React, { useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  visibleAlgorithmMetadata,
  getDefaultMode,
} from '../../algorithms/masterList';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';

const algorithms = Object.entries(visibleAlgorithmMetadata).reduce(
  (acc, [shorthand, meta]) => {
    if (!acc[meta.category]) acc[meta.category] = {};
    acc[meta.category][meta.name] = { ...meta, shorthand };
    return acc;
  },
  {}
);

function AlgoButton({ name, shorthand, isActive, onSelect }) {
  return (
    <button
      onClick={() => onSelect(shorthand)}
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        padding: '4px 0',
        width: '100%',
      }}
    >
      <span
        style={{
          fontWeight: isActive ? 'bold' : 'normal',
        }}
      >
        {name}
      </span>
    </button>
  );
}

AlgoButton.propTypes = {
  name: PropTypes.string.isRequired,
  shorthand: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

function AlgorithmMenu({ onClose }) {
  const { name, dispatch } = useContext(GlobalContext);
  const [displaySearch, setDisplaySearch] = useState(null);
  const [openCategories, setOpenCategories] = useState(
    name && visibleAlgorithmMetadata[name]
      ? [visibleAlgorithmMetadata[name].category]
      : []
  );

  const searchAlgorithm = useCallback((e) => {
    const input = e.target.value.trim().toLowerCase();
    if (!input) {
      setDisplaySearch(null);
      return;
    }

    const matches = [];
    Object.values(algorithms).forEach((algs) => {
      Object.entries(algs).forEach(([name, meta]) => {
        const { shorthand, keywords = [] } = meta;
        const mode = getDefaultMode(shorthand);

        if (
          name.toLowerCase().includes(input) ||
          keywords.some((kw) => kw.toLowerCase().includes(input))
        ) {
          matches.push({ name, shorthand, mode });
        }
      });
    });

    setDisplaySearch(matches);
  }, []);

  const toggleCategory = useCallback((cat) => {
    setOpenCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  }, []);

  const selectAlgorithm = useCallback((algoId) => {
    dispatch(GlobalActions.TOGGLE_PLAY, { playing: false });
    dispatch(GlobalActions.LOAD_ALGORITHM, { name: algoId, mode: getDefaultMode(algoId) });
    onClose();
  }, [dispatch, onClose]);

  return (
    <div className="flex h-100vh w-15vw flex-col gap-4">
      <input
        placeholder="Search..."
        onChange={searchAlgorithm}
      />

      <div>
        {displaySearch ? (
          displaySearch.map(({ name, shorthand }) => (
            <AlgoButton
              key={shorthand}
              name={name}
              shorthand={shorthand}
              isActive={name === shorthand}
              onSelect={selectAlgorithm}
            />
          ))
        ) : (
          Object.entries(algorithms).map(([category, algs]) => {
            const isOpen = openCategories.includes(category);
            return (
              <section key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                >
                  <span>{category}</span>
                  <span style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                    ▶
                  </span>
                </button>

                {isOpen && (
                  <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                    {Object.values(algs).map(({ name, shorthand }) => (
                      <AlgoButton
                        key={shorthand}
                        name={name}
                        shorthand={shorthand}
                        isActive={name === shorthand}
                        onSelect={selectAlgorithm}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

AlgorithmMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AlgorithmMenu;
