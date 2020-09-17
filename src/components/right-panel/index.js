import React from 'react';
import '../../styles/RightPanel.scss';
import HeaderButton from './HeaderButton';
import Explanation from './Explanation';
import Pseudocode from './Pseudocode';
import ExtraInfo from './ExtraInfo';

function RightPanel() {
  const buttons = [
    {
      id: 0,
      label: 'Code',
      display: <Pseudocode />,
    },
    {
      id: 1,
      label: 'Background',
      display: <Explanation />,
    },
    {
      id: 2,
      label: 'More',
      display: <ExtraInfo />,
    },

  ];

  const [state, setState] = React.useState(0);

  const getBtnState = (val) => {
    setState(val);
  };
  return (
    <>
      <HeaderButton value={buttons} onChange={getBtnState} />
      <div className="textAreaContainer">
        {buttons[state].display}
      </div>
    </>
  );
}

export default RightPanel;
