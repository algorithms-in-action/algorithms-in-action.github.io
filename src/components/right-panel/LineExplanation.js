import React from 'react';
import PropTypes from 'prop-types';
import ControlButton from '../common/ControlButton';
import { ReactComponent as Cancel } from '../../assets/icons/cancel.svg';

function LineExplanation({ explanation, onCancel }) {
  return (
    <div className="lineExplanation">
      <div className="lEtitle">Explanation</div>
      <ControlButton
        icon={<Cancel />}
        className="greyRoundBtn"
        id="cancelLineExplainBtn"
        onClick={() => {
          onCancel();
        }}
      />
      {explanation}
    </div>
  );
}

LineExplanation.propTypes = {
  explanation: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LineExplanation;
