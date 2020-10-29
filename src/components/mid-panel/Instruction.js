import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Instruction.scss';

function Instruction({ instructions }) {
  let numOfInstruction = 0;
  let numOfLine = 0;

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
                        <div className="lineContent">{str}</div>
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
