import React from 'react';

import Explanation from './Explanation';
import Pseudocode from './Pseudocode';

function CodeExplanation() {
  const [isExplanation, setIsExplanation] = React.useState(true);
  const isExplanationTrue = () => setIsExplanation(true);
  const isExplanationFalse = () => setIsExplanation(false);

  return (
    <>
      <div className="codeExplanationButton">
        <button
          className={isExplanation ? 'active' : 'notActive'}
          type="button"
          value="explanation"
          onClick={isExplanationTrue}
        >
          Explanation
        </button>
        <button
          className={isExplanation ? 'notActive' : 'active'}
          type="button"
          value="pseudocode"
          onClick={isExplanationFalse}
        >
          Pseudocode
        </button>
      </div>
      {isExplanation ? <Explanation /> : <Pseudocode />}
    </>
  );
}

export default CodeExplanation;
