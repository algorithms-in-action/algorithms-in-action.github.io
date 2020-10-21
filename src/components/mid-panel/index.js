import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/MidPanel.scss';
import { increaseFontSize, setFontSize } from '../top/helper';


function MidPanel({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const fontID = 'algorithmTitle';

  useEffect(() => {
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [fontSize, fontSizeIncrement]);


  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div className="algorithmTitle" id={fontID}>{algorithm.name}</div>
      </div>
      <div className="midPanelBody">
        <div className="cover-show-instructions" id="cover-show-instructions">
          {(() => {
            switch (algorithm.id) {
              case 'binarySearchTree': return 'tree';
              case 'quickSort': return 'quickSort';
              case 'heapSort': return 'heapSort';
              case 'tranitiveClosure': return 'transitiveClosure';
              case 'prim': return 'prim';
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
