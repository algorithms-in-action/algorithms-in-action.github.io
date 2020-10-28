import React from 'react';

import '../../styles/RightPanel.scss';
import PropTypes from 'prop-types';

function ButtonPanel({ onClick, name }) {
  return (
    <button className="bottomBtn" type="button" onClick={onClick}>
      {name}
    </button>

  );
}

export default ButtonPanel;
ButtonPanel.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};
