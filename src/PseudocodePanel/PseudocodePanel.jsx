import React from 'react';
import './PseudocodePanel.css';
import { test } from '../pseudocodes.json';
import NavigationBar from '../NavigationBar/NavigationBar';
import LineExplanation from '../LineExplanation/LineExplanation';

function PseudocodePanel() {
  return (
    <div className="PseudocodePanel">
      <NavigationBar className="PseudocodePanel-NavigationBar" />
      <textarea className="PseudocodePanel-TextArea" value={test} />
      <LineExplanation className="PseudocodePanel-LineExplanation" />
    </div>
  );
}

export default PseudocodePanel;
