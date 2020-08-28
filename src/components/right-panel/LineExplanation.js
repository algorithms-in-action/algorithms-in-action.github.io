import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import findBookmark from '../../pseudocode/findBookmark';

function LineExplanation() {
  const { algorithm } = useContext(GlobalContext);
  return (
    // TODO: to be removed when insertion explanation is ready
    algorithm.id === 'binaryTreeSearch'
      ? (
        <div className="lineExplanation">
          {findBookmark(algorithm.pseudocode, algorithm.bookmark).explanation}
        </div>
      )
      : null
  );
}

export default LineExplanation;
