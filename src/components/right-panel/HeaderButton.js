import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as AddIcon } from '../../resources/icons/add.svg';

function HeaderButton({ value, onChange }) {
  const [state, setState] = useState(value[0]);

  const updateState = (val) => {
    setState(val);
    onChange(val);
  };

  return (
    <>
      <div className="rightPanelButtons">
        <button
          className={(state === value[0]) ? 'active' : 'notActive'}
          type="button"
          value={value[0]}
          onClick={(e) => updateState(e.target.value)}
        >
          Code
        </button>
        <button
          className={(state === value[1]) ? 'active' : 'notActive'}
          type="button"
          value={value[1]}
          onClick={(e) => updateState(e.target.value)}
        >
          Background
        </button>
        <button
          className={(state === value[2]) ? 'active' : 'notActive'}
          type="button"
          value={value[2]}
          onClick={(e) => updateState(e.target.value)}
        >
          <AddIcon />
        </button>
      </div>

    </>
  );
}

HeaderButton.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
export default HeaderButton;
