import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Instruction.scss';
import { KEY_WORDS } from '../../algorithms/instructions';

function Instruction({ instructions }) {
  let numOfInstruction = 0;
  let numOfLine = 0;

  const giveKeywordClass = (str) => {
    for (let i = 0; i < KEY_WORDS.length; i += 1) {
      if (str.includes(KEY_WORDS[i])) {
        const after = str.slice(str.indexOf(KEY_WORDS[i]) + KEY_WORDS[i].length);
        const before = str.slice(0, str.indexOf(KEY_WORDS[i]));
        return (
          <div className="lineContent">
            { before }
            <span className="instructionKey">{KEY_WORDS[i]}</span>
            { after }
          </div>
        );
      }
    }

    return (
      <div className="lineContent">
        {str}
      </div>
    );
  };


  return (
    <div className="coverShowInstructions" id="coverShowInstructions">
      {
        instructions.map((ins) => {
          numOfInstruction += 1;

          return (
            <div
              className="instructionContainer"
              id={`instruction-${numOfInstruction}`}
              key={numOfInstruction}
            >
              <div className="instructionTitle">
                {ins.title}
              </div>
              <div className="instructionContent">
                {
                  ins.content.map((str, index) => {
                    numOfLine += 1;
                    return (
                      <div className="instructionLine" key={numOfLine}>
                        <div className="lineNumber">{`${index + 1}.`}</div>
                        {giveKeywordClass(str)}
                        {/* <div className="lineContent">{str}</div> */}
                      </div>
                    );
                  })
                }
              </div>
            </div>
          );
        })

      }

    </div>
  );
}

export default Instruction;

Instruction.propTypes = {
  instructions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
};
