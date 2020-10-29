import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/MidPanel.scss';
import { increaseFontSize, setFontSize } from '../top/helper';
import Instruction from './Instruction';


function MidPanel({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const fontID = 'algorithmTitle';
  useEffect(() => {
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [fontSize, fontSizeIncrement]);
  let numOfInstruction = 0;

  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div className="algorithmTitle" id={fontID}>{algorithm.name}</div>
      </div>
      <div className="midPanelBody">
        {
          algorithm.instructions.map((ins, index) => {
            numOfInstruction += 1;
            return (
              <Instruction
                instruction={ins}
                id={index}
                key={numOfInstruction}
              />
            );
          })
        }
        {algorithm.chunker && algorithm.chunker.getVisualisers().map((o) => o.render())}
      </div>
    </div>
  );
}


export default MidPanel;
MidPanel.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
