import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function ClickTrigger() {
  useEffect(() => {
    const button = document.getElementById('startBtnGrp');
    if (button) {
      button.click();
    }
    // Cleans up the dummy component
    ReactDOM.unmountComponentAtNode(
      document.getElementById('clickEventContainer'),
    );
  }, []);

  return null;
}

// This renders the button, simulating a click
export function triggerButtonClick() {
  // Make sure the div exists
  let div = document.getElementById('clickEventContainer');
  if (!div) {
    div = document.createElement('div');
    div.id = 'clickEventContainer';
    document.body.appendChild(div);
  }
  ReactDOM.render(<ClickTrigger />, div);
}
