import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ControlButton from '../common/ControlButton';
import { ReactComponent as Cancel } from '../../assets/icons/cancel.svg';
import { setFontSize, increaseFontSize } from '../top/helper';


function LineExplanation({ explanation, fontSize, fontSizeIncrement }) {
  const { dispatch } = useContext(GlobalContext);
  const fontID = 'lineExplanation';

  useEffect(() => {
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [fontSizeIncrement, fontSize]);

  return (
    <div className="lineExplanation" id={fontID}>
      <div className="lEHeader">
        <div className="lEtitle">Explanation</div>
        <ControlButton
          icon={<Cancel />}
          className="greyRoundBtn"
          id="cancelLineExplainBtn"
          onClick={() => {
            dispatch(GlobalActions.LineExplan, '');
          }}
        />
      </div>
      <div className="lEDesc">
        {explanation}
      </div>
    </div>
  );
}

export default LineExplanation;

LineExplanation.propTypes = {
  explanation: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
