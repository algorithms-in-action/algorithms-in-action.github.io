import React, { useState } from 'react';
import '../../styles/Checkbox.scss';

function Checkbox() {
  const [check, setCheck] = useState(true);

  const handleChange = (checked) => {
    setCheck(checked);
    // console.log('Update Global State for Toggling zoom');
  };

  const handleClick = () => {
    setCheck(!check);
    // console.log('Update Global State for Toggling zoom');
  };

  return (
    <div className="wrapper">
      <div className="input_wrapper">
        <input
          id="zoom-checkbox"
          type="checkbox"
          checked={check}
          onChange={(e) => {
            handleChange(e.target.checked);
          }}
        />
        <span
          className="is_checked"
          aria-hidden="true"
          onClick={() => {
            handleClick();
          }}
        >
          Enabled
        </span>
        <span
          className="is_unchecked"
          aria-hidden="true"
          onClick={() => {
            handleClick();
          }}
        >
          Disabled
        </span>
      </div>
    </div>
  );
}

export default Checkbox;
