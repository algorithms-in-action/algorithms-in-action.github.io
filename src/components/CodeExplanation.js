/* eslint-disable import/no-named-as-default-member */
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
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
      <div className="textAreaContainer">
        {isExplanation ? <Explanation /> : <Pseudocode />}
      </div>
    </>
  );
}

export default CodeExplanation;
