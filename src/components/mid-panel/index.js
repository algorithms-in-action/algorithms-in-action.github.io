import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/order
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/MidPanel.scss';
/* eslint-disable-next-line import/no-named-as-default */
import Popup from 'reactjs-popup';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';
import HelpIcon from '@mui/icons-material/Help';
import CodeBlock from '../../markdown/code-block';
import { increaseFontSize, setFontSize } from '../top/helper';
import ControlButton from '../common/ControlButton';
import Button from '@mui/material/Button';

function MidPanel({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const fontID = 'algorithmTitle';
  const prevButtonID = 'prevPageButton';
  const nextButtonID = 'nextPageButton';
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);

    setFontSize(prevButtonID, fontSize);
    increaseFontSize(prevButtonID, fontSizeIncrement);
    
    setFontSize(nextButtonID, fontSize);
    increaseFontSize(nextButtonID, fontSizeIncrement);
  }, [fontSize, fontSizeIncrement]);

  useEffect(() => {
    let text = '# Instructions \n\n\n';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < algorithm.instructions.length; i++) {
      text = `${text}## ${algorithm.instructions[i].title}\n\n\n`;
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < algorithm.instructions[i].content.length; j++) {
        text = `${text + (j + 1)}.\t${algorithm.instructions[i].content[j]}\n\n`;
      }
    }

    setExplanation(text);
  }, [algorithm.instructions]);

  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div>
          <ControlButton icon={<HelpIcon />} onClick={() => setOpen((o) => !o)} />
          <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <div className="textArea">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <a className="close" onClick={closeModal}>
                &times;
              </a>
              {/* eslint-disable-next-line max-len */}
              <ReactMarkDown source={explanation} escapeHtml={false} renderers={{ code: CodeBlock }} plugins={[toc]} />
            </div>
          </Popup>
        </div>

        <div className="prevPageButton" id={prevButtonID} >
          <Button
            //onClick={() => prev()}
            style={{ width: '120px', height: '50px', fontSize: '16px' }}
          >
            Previous
          </Button>
        </div>

        <div className="algorithmTitle" id={fontID}>{algorithm.name}</div>

        <div className="nextPageButton" id={nextButtonID} >
          <Button
            //onClick={() => next()}
            style={{ width: '120px', height: '50px', fontSize: '16px' }}
          >
            Next
          </Button>
        </div>

      </div>
      <div className="midPanelBody">
        {algorithm.chunker
          && algorithm.chunker.getVisualisers().map((o) => o.render())}
      </div>
    </div>
  );
}

export default MidPanel;
MidPanel.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
