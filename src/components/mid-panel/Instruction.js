import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Instruction.scss';

function Instruction({ id, instruction }) {
  let numOfLine = 0;
  return (
    <div className="coverShowInstructions" id={`coverShowInstructions-${id}`}>
      <div className="instructionContainer">
        <div className="instructionTitle">
          {instruction.title}
        </div>
        <div className="instructionContent">
          {
          instruction.content.map((content, index) => {
            numOfLine += 1;
            return (
              <div className="instructionLine" key={numOfLine}>
                <div className="lineNumber">{`${index + 1}.`}</div>
                <div className="lineContent">{content}</div>
              </div>
            );
          })
          }
        </div>
      </div>
    </div>
  );
}

export default Instruction;

Instruction.propTypes = {
  id: PropTypes.number.isRequired,
  instruction: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
