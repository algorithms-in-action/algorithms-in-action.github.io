import React from 'react';
import logo from './logo.svg';
import './App.css';
import parsePseudocode from './pseudocode/parse';
import algorithms from './algorithms';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          <code>src/App.js</code>
          and save to reload.
        </p>
        This is a short example to show correct parsing of the pseudocode
        <br />
        { JSON.stringify(parsePseudocode(algorithms.binaryTreeSearch.pseudocode)) }
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
