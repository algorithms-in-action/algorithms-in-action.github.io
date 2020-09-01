/* eslint-disable react/prop-types */
import React from 'react';
import { Tooltip } from '@material-ui/core';
import '../../styles/NextLineButton.scss';

function ControlButton({
  icon, type, disabled, onClick,
}) {
  return (
    <Tooltip title="Please run the algorithm first" disableHoverListener={!disabled}>
      <span>
        <button
          type="button"
          // id="NextButton"
          className={disabled ? `btnDisabled ${type}` : `btnActive ${type}`}
          disabled={disabled}
          onClick={onClick}
        >
          {icon}
        </button>
      </span>
    </Tooltip>
  );
}

export default ControlButton;
