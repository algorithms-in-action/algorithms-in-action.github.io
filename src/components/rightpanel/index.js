import React from 'react';
import '../../styles/RightPanel.scss';
import HeaderButton from './HeaderButton';
import Explanation from './Explanation';
import Pseudocode from './Pseudocode';
import MoreInfo from './MoreInfo';

const BTN_1 = 'BTN_1';
const BTN_2 = 'BTN_2';
const BTN_3 = 'BTN_3';

function RightPanel() {
  const [state, setState] = React.useState(BTN_1);

  const getBtnState = (val) => {
    switch (val) {
      case BTN_1:
        setState(BTN_1);
        break;
      case BTN_2:
        setState(BTN_2);
        break;
      case BTN_3:
        setState(BTN_3);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <HeaderButton value={[BTN_1, BTN_2, BTN_3]} onChange={getBtnState} />
      <div className="textAreaContainer">
        {(() => {
          switch (state) {
            case BTN_1:
              return <Pseudocode />;
            case BTN_2:
              return <Explanation />;
            case BTN_3:
              return <MoreInfo />;
            default:
              return <Explanation />;
          }
        })()}
      </div>
    </>
  );
}

export default RightPanel;
