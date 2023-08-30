//SIM Event - DanistyWuKids
import React, { useContext,useEffect } from 'react';
import ControlButton from '../../../components/common/ControlButton';
import { closeInstructions } from '../../../components/mid-panel/helper';
import { GlobalContext } from '../../../context/GlobalState';
import '../../../styles/Param.scss';


const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
function simulateMouseClick(element){
  mouseClickEvents.forEach(mouseEventType => element.dispatchEvent(new MouseEvent(mouseEventType, {view: window,bubbles: true,cancelable: true,buttons: 1})));
}

function DualValueForm(props) {
    const {
        // eslint-disable-next-line
        formClassName, name, buttonName, input1, input2, textInput, onAdd, handleSubmit, disabled
    } = props;

    const { algorithm } = useContext(GlobalContext);

    const closeInstructionsFun = () => {
        if (algorithm.name === 'Quicksort') {
          // setQuicksortPlay(false)
          sessionStorage.setItem('isPivot', false);
          sessionStorage.setItem('quicksortPlay', false);
        }
        closeInstructions();
      };

    useEffect(() => {var element = document.querySelector('button[id="startBtnGrp"]');simulateMouseClick(element);},[]);

    return (
        <form className={formClassName} onSubmit={handleSubmit}>
            <div className="outerInput">
                <div className="union">
                    <div className="unionAddInput">
                        <div className="inputGrouped">
                        <input type="text" value={input1.value} onChange={input1.onChange} 
                        placeholder='Set 1'/>
                        { /*name={name}... we may need to add 'name', not certain.*/}
                        <input type="text" value={input2.value} onChange={input2.onChange}
                        placeholder='Set 2'/>
                        </div>
                        <button type="button" onClick={onAdd} className="btn greyWordBtn">Add</button>
                    </div>

                    <div className="unionTextInput">
                        <input type="text" name="unionTextInput" value={textInput.value} onChange={textInput.onChange} />
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