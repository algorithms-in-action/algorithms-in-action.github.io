import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/RightPanel.scss';
import HeaderButton from './HeaderButton';
import Explanation from './Explanation';
import Pseudocode from './Pseudocode';
import ExtraInfo from './ExtraInfo';

function RightPanel({ fontSize, fontSizeIncrement }) {
  const buttons = [
    {
      id: 0,
      label: 'Background',
      display: <Explanation fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />,
    },
    {
      id: 1,
      label: 'Code',
      display: <Pseudocode fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />,
    },
    {
      id: 2,
      label: 'More',
      display: <ExtraInfo fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />,
    },

  ];

  const [state, setState] = React.useState(0);

  const getBtnState = (val) => {
    setState(val);
  };
  return (
    <>
      <HeaderButton value={buttons} onChange={getBtnState} />
      {buttons[state].display}
    </>
  );
}

export default RightPanel;
RightPanel.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
