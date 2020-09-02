/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import '../../styles/ControlButton.scss';

function ControlButton(props) {
  const {
    icon, type, disabled, onClick, children,
  } = props;
  return (
    <button
      type="button"
      className={disabled ? `btnDisabled ${type}` : `btnActive ${type}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon || children}
    </button>
  );
}

export default ControlButton;
