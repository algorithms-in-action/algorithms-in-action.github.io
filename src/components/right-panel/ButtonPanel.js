import React from 'react';

import '../../styles/RightPanel.scss';
import PropTypes from 'prop-types';

function ButtonPanel({ onExpand }) {
  return (
    <div className="btnPanel">
      <button className="bottomBtn" type="button" onClick={onExpand}>
        Collapse All
      </button>
    </div>
  );
}

export default ButtonPanel;
ButtonPanel.propTypes = {
  onExpand: PropTypes.func.isRequired,
};
