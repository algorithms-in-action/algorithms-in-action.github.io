/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';

/**
 * The ParamForm wraps a input, icon(optional) and a button.
 */
function ParamForm(props) {
  const {
    formClassName, name, buttonName, value,
    onChange, handleSubmit, children, disabled,
  } = props;

  const cancelCover = () => {
    document.getElementById('cover-show-instructions').style.display = 'none';
  };

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
            onClick={() => cancelCover()}
            type="submit"
            disabled={disabled}
          >
            {buttonName}
          </ControlButton>
        </div>
      </div>
    </form>
  );
}

export default ParamForm;
