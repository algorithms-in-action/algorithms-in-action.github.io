/* eslint-disable react/prop-types */
import React from 'react';
import '../../styles/NextLineButton.scss';

function ControlButton({
  icon, type, disabled, onClick,
}) {
  return (
    <button
      type="button"
      className={disabled ? `btnDisabled ${type}` : `btnActive ${type}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

export default ControlButton;
