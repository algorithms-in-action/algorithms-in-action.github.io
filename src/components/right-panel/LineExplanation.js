import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ControlButton from '../common/ControlButton';
import { ReactComponent as Cancel } from '../../assets/icons/cancel.svg';

function LineExplanation({ explanation }) {
  const { dispatch } = useContext(GlobalContext);
  return (
    <div className="lineExplanation">
      <div className="lEtitle">Explanation</div>
      <ControlButton
        icon={<Cancel />}
        className="greyRoundBtn"
        id="cancelLineExplainBtn"
        onClick={() => {
          dispatch(GlobalActions.LineExplan, '');
        }}
      />
      {explanation}
    </div>
  );
}

LineExplanation.propTypes = {
  explanation: PropTypes.string.isRequired,
};

export default LineExplanation;
