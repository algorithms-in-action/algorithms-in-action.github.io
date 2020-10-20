import React from 'react';
import '../../styles/RightPanel.scss';
import PropTypes from 'prop-types';

function ButtonPanel({ isExpanded, onExpand }) {
  return (
    <div className="btnPanel">
      <button className="bottomBtn" type="button" onClick={onExpand}>
        {
          isExpanded
            ? 'Condense'
            : 'Expand'
        }
      </button>
    </div>
  );
}

export default ButtonPanel;
ButtonPanel.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
};
