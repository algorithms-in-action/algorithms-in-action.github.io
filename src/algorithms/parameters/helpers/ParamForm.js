/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import ControlButton from '../../../components/common/ControlButton';
import { closeInstructions } from '../../../components/mid-panel/helper';
import { GlobalContext } from '../../../context/GlobalState';
import '../../../styles/Param.scss';
/**
 * The ParamForm wraps a input, icon(optional) and a button.
 */
function ParamForm(props) {
  const {
    formClassName, name, buttonName, value,
    onChange, handleSubmit, children, disabled,
  } = props;
  // eslint-disable-next-line
  const { algorithm } = useContext(GlobalContext);

  const closeInstructionsFun = () => {
    if (algorithm.name === 'Quicksort') {
      // setQuicksortPlay(false)
      sessionStorage.setItem('isPivot', false);
      sessionStorage.setItem('quicksortPlay', false);
    }
    closeInstructions();
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
            onClick={closeInstructionsFun}
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
