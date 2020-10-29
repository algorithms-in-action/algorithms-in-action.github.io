import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/InstructionCover.scss';
import '../../styles/MidPanel.scss';
import { increaseFontSize, setFontSize } from '../top/helper';


function MidPanel({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const fontID = 'algorithmTitle';
  useEffect(() => {
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [fontSize, fontSizeIncrement]);

  const bstInstructions = (
    <div>
      <div className="instructionTitle">
        Instructions
      </div>
      <div className="instructionSubTitle">
        How to use the parameters
      </div>
      <div className="instructionContent">
        <div className="instructionSubContent">1. Enter inputs located in the below middle panel.</div>
        <div className="instructionSubContent">2. Click on the “INSERT” button to see the validation of the input.</div>
        <div className="instructionSubContent">3. Enter the input needed to be searched and Click on the “SEARCH” button.</div>
        <diiv className="instructionSubContent">
          4. For valid input, click on the play button to see the behavior
          of the algorithm with different parameters.
        </diiv>

      </div>
      <div className="instructionSubTitle">
        How to control the executing speed of an algorithm.
      </div>
      <div className="instructionContent">
        1. Press on the slider bar to change the speed from slow (left) to fast (right).
      </div>
    </div>
  );

  const quickSortInstructions = (
    <div>
      <div className="instructionTitle">
        Instructions
      </div>
      <div className="instructionSubTitle">
        How to use the parameters
      </div>
      <div className="instructionContent">
        <div className="instructionSubContent">1. Enter inputs located in the below middle panel.</div>
        <div className="instructionSubContent">2. Click on the “SORT” button to see the validation of the input.</div>
        <diiv className="instructionSubContent">
          3. For valid input, click on the play button to see the behavior
          of the algorithm with different parameters.
        </diiv>

      </div>
      <div className="instructionSubTitle">
        How to control the executing speed of an algorithm.
      </div>
      <div className="instructionContent">
        1. Press on the slider bar to change the speed from slow (left) to fast (right).
      </div>
    </div>
  );

  const heapSortInstructions = (
    <div>
      <div className="instructionTitle">
        Instructions
      </div>
      <div className="instructionSubTitle">
        How to use the parameters
      </div>
      <div className="instructionContent">
        <div className="instructionSubContent">1. Enter inputs located in the below middle panel.</div>
        <div className="instructionSubContent">2. Click on the “SORT” button to see the validation of the input.</div>
        <diiv className="instructionSubContent">
          3. For valid input, click on the play button to see the behavior
          of the algorithm with different parameters.
        </diiv>

      </div>
      <div className="instructionSubTitle">
        How to control the executing speed of an algorithm.
      </div>
      <div className="instructionContent">
        1. Press on the slider bar to change the speed from slow (left) to fast (right).
      </div>
    </div>
  );

  const transitiveClosureInstructions = (
    <div>
      <div className="instructionTitle">
        Instructions
      </div>
      <div className="instructionSubTitle">
        How to use the parameters
      </div>
      <div className="instructionContent">
        <div className="instructionSubContent">1. Enter SET number located in the below middle panel.</div>
        <div className="instructionSubContent">2. Click on the “SET” button to change the SET in the right.</div>
        <div className="instructionSubContent">3. Enter the value in the SET</div>
        <div className="instructionSubContent">4. Click on the “Run” buton to generate the graph </div>
        <diiv className="instructionSubContent">
          5. click on the play button to see the behavior
          of the algorithm with different parameters.
        </diiv>

      </div>
      <div className="instructionSubTitle">
        How to control the executing speed of an algorithm.
      </div>
      <div className="instructionContent">
        1. Press on the slider bar to change the speed from slow (left) to fast (right).
      </div>
    </div>
  );

  const primInstructions = (
    <div>
      <div className="instructionTitle">
        Instructions
      </div>
      <div className="instructionSubTitle">
        How to use the parameters
      </div>
      <div className="instructionContent">
        <div className="instructionSubContent">1. Enter SET number located in the below middle panel.</div>
        <div className="instructionSubContent">2. Click on the “SET” button to change the SET in the right.</div>
        <div className="instructionSubContent">3. Enter the value in the SET</div>
        <div className="instructionSubContent">4. Click on the “Run” buton to generate the graph </div>
        <diiv className="instructionSubContent">
          5. click on the play button to see the behavior
          of the algorithm with different parameters.
        </diiv>

      </div>
      <div className="instructionSubTitle">
        How to control the executing speed of an algorithm.
      </div>
      <div className="instructionContent">
        1. Press on the slider bar to change the speed from slow (left) to fast (right).
      </div>
    </div>
  );

  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div className="algorithmTitle" id={fontID}>{algorithm.name}</div>
      </div>
      <div className="midPanelBody">
        <div className="coverShowInstructions" id="coverShowInstructions">
          {/* The Cover for Instructions */}
          {(() => {
            switch (algorithm.id) {
              case 'binarySearchTree': return bstInstructions;
              case 'quickSort': return quickSortInstructions;
              case 'heapSort': return heapSortInstructions;
              case 'transitiveClosure': return transitiveClosureInstructions;
              case 'prim': return primInstructions;
              default: return null;
            }
          }
          )()}
        </div>
        {/* Animation Goes here */}
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
