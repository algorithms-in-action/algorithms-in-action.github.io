import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Instruction.scss';

function Instruction({ instruction }) {
  return (
    <div className="coverShowInstructions" id="coverShowInstructions">
      <div className="instructionTitle">
        {instruction.title}
      </div>
      <div className="instructionSubTitle">
        {instruction.subtitle}
      </div>
      <div className="instructionContent">
        {
          instruction.content.map((str) => (
            <div className="instructionSubContent">
              {str}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Instruction;

Instruction.propTypes = {
  instruction: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    content: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
