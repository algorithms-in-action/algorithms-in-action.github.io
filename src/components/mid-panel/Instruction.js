import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Instruction.scss';

function Instruction({ instruction }) {
  return (
    <div className="coverShowInstructions" id="coverShowInstructions">
      <div className="instructionContainer">
        <div className="instructionTitle">
          {instruction.title}
        </div>
        <div className="instructionContent">
          {
          instruction.content.map((str, index) => (
            <div className="instructionLine">
              <div className="lineNumber">{`${index + 1}.`}</div>
              <div className="lineContent">{str}</div>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  );
}

export default Instruction;

Instruction.propTypes = {
  instruction: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
