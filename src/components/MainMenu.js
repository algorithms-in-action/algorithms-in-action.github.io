import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../assets/logo.svg";
import { DeployedAlgorithmCategoryList } from "../algorithms/masterList";
import PropTypes from "prop-types";
import { easing } from "@mui/material";
/* eslint-disable jsx-a11y/mouse-events-have-key-events */

const baseUrl = window.location.origin;

const CategorySection = ({ category, items }) => (
  <motion.div
    transition={{ duration: 0.1 }}
    style={{
      background: "rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: "16px",
      margin: "12px",
      backdropFilter: "blur(8px)",
      width: "250px",
      textAlign: "center",
      transition: "background 0.1s",
    }}
    whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.2)" }}
  >
    <h2
      style={{
        color: "rgba(255,255,255,0.9)",
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "8px",
      }}
    >
      {category}
    </h2>
    {items.map(({ name, url }) => (
      <a
        key={url}
        href={url}
        style={{
          display: "block",
          color: "#8ec9ff",
          textDecoration: "none",
          fontSize: "14px",
          padding: "4px 0",
          transition: "color 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.color = "#b9e2ff")}
        onMouseOut={(e) => (e.target.style.color = "#8ec9ff")}
      >
        {name}
      </a>
    ))}
  </motion.div>
);

const nameToInfo = DeployedAlgorithmCategoryList.flatMap(({ algorithms }) =>
  algorithms.map(({ name, shorthand, mode, keywords }) => ({
    name,
    url: `${baseUrl}/animation/?alg=${shorthand}&mode=${mode}`,
    keywords: (keywords ?? []).map((keyword) => keyword.toLowerCase()),
  }))
);

const Mainmenu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const query = searchTerm.toLowerCase();

  const filteredAlgorithms = nameToInfo.filter(
    ({ name, keywords }) =>
      name.toLowerCase().includes(query) ||
      keywords.some((kw) => kw.includes(query))
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #081a3a, #153f87)",
        color: "white",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: "48px", width: "48px" }} />
        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "white" }}>
          Algorithms In Action
        </h1>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "32px",
        }}
      >
        <SearchIcon
          fontSize="small"
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.6)",
            pointerEvents: "none",
            zIndex: 100,
          }}
        />
        <input
          type="text"
          placeholder="Search algorithms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px 8px 40px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            border: "none",
            outline: "none",
            fontSize: "14px",
            backdropFilter: "blur(6px)",
            transition: "background-color 0.2s ease",
          }}
          onFocus={(e) =>
            (e.target.style.background = "rgba(255,255,255,0.2)")
          }
          onBlur={(e) => (e.target.style.background = "rgba(255,255,255,0.1)")}
        />
      </div>

      {
      /* 
        Im so confused the non deprecated version of mode="wait" which supposedly does the same thing
        does not actually "wait" like exitBeforeEnter does. OMG I am an idiot, this project is using
        an old version of framer motion lol.
      */
      }
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={query ? "search" : "categories"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          style={{
            display: query ? "flex" : "grid",
            flexWrap: query ? "wrap" : "unset",
            gridTemplateColumns: query ? "none" : "repeat(3, 1fr)",
            justifyContent: "center",
          }}
        >
          {query ? (
            filteredAlgorithms.length > 0 ? (
              filteredAlgorithms.map(({ name, url }) => (
                <motion.div
                  key={url}
                  transition={{ duration: 0.15 }}
                  whileHover={{scale: 1.02}}
                >
                  <a
                    href={url}
                    style={{
                      display: "block",
                      textAlign: "center",
                      color: "white",
                      textDecoration: "none",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      margin: "8px",
                      fontWeight: "500",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.background = "rgba(255,255,255,0.2)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.background = "rgba(255,255,255,0.1)")
                    }
                  >
                    {name}
                  </a>
                </motion.div>
              ))
            ) : (
              <p style={{ color: "rgba(255,255,255,0.7)" }}>No results found</p>
            )
          ) : (
            DeployedAlgorithmCategoryList.map(({ category, algorithms }) => (
              <CategorySection
                key={category}
                category={category}
                items={algorithms.map(({ name, shorthand, mode }) => ({
                  name,
                  url: `${baseUrl}/animation/?alg=${shorthand}&mode=${mode}`,
                }))}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      <a
        href="/about"
        style={{
          marginTop: "40px",
          color: "#8ec9ff",
          fontSize: "14px",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.color = "#b9e2ff")}
        onMouseOut={(e) => (e.target.style.color = "#8ec9ff")}
      >
        About
      </a>
    </div>
  );
};

CategorySection.propTypes = {
  category: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Mainmenu;
