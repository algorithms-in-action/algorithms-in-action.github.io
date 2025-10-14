import React, { useState, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import {
  visibleAlgorithmMetadata,
  getDefaultMode,
} from "../../algorithms/masterList";
import { GlobalActions } from "../../context/actions";
import { GlobalContext } from "../../context/GlobalState";
import { flushSync } from "react-dom";

const algorithms = Object.entries(visibleAlgorithmMetadata).reduce(
  (acc, [shorthand, meta]) => {
    if (!acc[meta.category]) acc[meta.category] = {};
    acc[meta.category][meta.name] = { ...meta, shorthand };
    return acc;
  },
  {}
);

function AlgoButton({ name, shorthand, isActive, onSelect }) {
  const baseStyle = {
    all: "unset",
    background: "var(--left-item-bg)",
    color: isActive
      ? "var(--left-item-font-active)"
      : "var(--left-item-font)",
    cursor: "pointer",
    textAlign: "left",
    padding: "6px 10px",
    width: "100%",
    fontWeight: isActive ? "bold" : "normal",
    transition: "all 0.2s ease",
  };

  return (
    <button
      onClick={() => onSelect(shorthand)}
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--left-item-bg-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--left-item-bg)";
      }}
    >
      {name}
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
    if (!input) return setDisplaySearch(null);

    const matches = [];
    Object.values(algorithms).forEach((algs) => {
      Object.entries(algs).forEach(([algoName, meta]) => {
        const { shorthand, keywords = [] } = meta;
        if (
          algoName.toLowerCase().includes(input) ||
          keywords.some((kw) => kw.toLowerCase().includes(input))
        ) {
          matches.push({ name: algoName, shorthand });
        }
      });
    });

    setDisplaySearch(matches);
  }, []);

  const toggleCategory = useCallback((cat) => {
    setOpenCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const selectAlgorithm = useCallback(
    (algoId) => {
      // Forget it, changing global actions dispatch
      // to use a functional updater version breaks
      // collapse chunk plugins.
      // Below SHOULD BE possible without flushSync.
      flushSync(() => {
        dispatch(GlobalActions.TOGGLE_PLAY, { playing: false });
      });

      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: algoId,
        mode: getDefaultMode(algoId),
      });
      onClose();
    },
    [dispatch, onClose]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "20vw",
        height: "100%",
        background: "var(--left-bg)",
        color: "var(--left-font)",
        overflowY: "auto",
      }}
    >
      <input
        placeholder="Search..."
        onChange={searchAlgorithm}
        style={{
          all: "unset",
          width: "100%",
          height: "40px",
          paddingLeft: "8px",
          marginBottom: "12px",
          background: "var(--left-search-bg)",
          color: "var(--left-font)",
          outline: "none",
          transition: "all 0.2s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.background = "var(--left-search-bg-focus)";
          e.currentTarget.style.borderColor = "var(--left-search-border-focus)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = "var(--left-search-bg)";
          e.currentTarget.style.borderColor = "var(--left-search-border)";
        }}
      />

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
            <section key={category} style={{ marginBottom: "6px" }}>
              <button
                onClick={() => toggleCategory(category)}
                style={{
                  all: "unset",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  fontWeight: "bold",
                  background: "var(--left-cat-bg)",
                  cursor: "pointer",
                  marginLeft: "4px",
                  marginRight: "4px",
                  marginBottom: "4px",
                  color: "var(--left-cat-font)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--left-cat-bg-hover)";
                  e.currentTarget.style.borderColor =
                    "var(--left-cat-border-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--left-cat-bg)";
                  e.currentTarget.style.borderColor =
                    "var(--left-cat-border)";
                }}
              >
                <span>{category}</span>
                <span
                  style={{
                    marginRight: "8px",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    color: "var(--left-cat-font)",
                  }}
                >
                  ▶
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{
                      overflow: "hidden",
                      marginTop: "4px",
                      marginLeft: "8px",
                      borderRadius: "4px",
                      paddingLeft: "4px",
                    }}
                  >
                    {Object.values(algs).map(({ name, shorthand }) => (
                      <AlgoButton
                        key={shorthand}
                        name={name}
                        shorthand={shorthand}
                        isActive={name === shorthand}
                        onSelect={selectAlgorithm}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })
      )}
    </div>
  );
}

AlgorithmMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AlgorithmMenu;
