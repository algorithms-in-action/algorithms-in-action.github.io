// SIM Event - DanistyWuKids
import React, { useEffect } from 'react';
import ControlButton from '../../../components/common/ControlButton';
import { closeInstructions } from '../../../components/mid-panel/helper';
import '../../../styles/Param.scss';

const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
function simulateMouseClick(element) {
  mouseClickEvents.forEach((mouseEventType) => element.dispatchEvent(
    new MouseEvent(mouseEventType, {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1,
    }),
  ));
}

/**
 * This form wraps a dual input, with an add and 'submit' button.
 */
function DualValueForm(props) {
  const {
    // eslint-disable-next-line
    formClassName, name, buttonName, input1, input2, textInput, onAdd, handleSubmit, disabled, placeholderVal1, placeholderVal2
  } = props;

  const closeInstructionsFun = () => {
    closeInstructions();
  };

  useEffect(() => { const element = document.querySelector('button[id="startBtnGrp"]'); simulateMouseClick(element); }, []);

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <div className="outerInput">
        <div className="dualColumnWrapper">
          <div className="dualAddInput">
            <div className="dualInputWrapper">
              <input
                type="text"
                // eslint-disable-next-line react/prop-types
                value={input1.value}
                // eslint-disable-next-line react/prop-types
                onChange={input1.onChange}
                placeholder={placeholderVal1}
              />
              { /* name={name}... we may need to add 'name', not certain. */}
              <input
                type="text"
                // eslint-disable-next-line react/prop-types
                value={input2.value}
                // eslint-disable-next-line react/prop-types
                onChange={input2.onChange}
                placeholder={placeholderVal2}
              />
            </div>
            <button type="button" onClick={onAdd} className="btn greyWordBtn">Add</button>
          </div>

          <div className="dualTextInput">
            <input
              type="text"
              name="textInput"
              // eslint-disable-next-line react/prop-types
              value={textInput.value}
              // eslint-disable-next-line react/prop-types
              onChange={textInput.onChange}
            />
            <div className="btnGrp">
              <ControlButton
                className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
                onClick={closeInstructionsFun}
                id="startBtnGrp"
                type="submit"
                disabled={disabled}
              >
                {buttonName}
              </ControlButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
export default DualValueForm;
