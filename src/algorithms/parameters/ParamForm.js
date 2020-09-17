/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import ControlButton from '../../components/common/ControlButton';
import '../../styles/Param.scss';

function ParamForm(props) {
  const {
    formClassName, name, value, onChange, handleSubmit, children, disabled,
  } = props;

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <div className="outerInput">
        <label className="inputText">
          <input
            name={name}
            type="text"
            value={value}
            onChange={onChange}
          />
        </label>
        <div className="btnGrp">
          {/** this children is left to add icons */}
          {children}
          <ControlButton
            className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
            type="submit"
            disabled={disabled}
          >
            {name}
          </ControlButton>
        </div>
      </div>
    </form>
  );
}

export default ParamForm;
