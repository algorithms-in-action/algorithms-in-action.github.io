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
import ShareIcon from '@mui/icons-material/Share';

function MidPanel({ fontSize, fontSizeIncrement }) {
  const { algorithm, algorithmKey, category, mode, nodes, searchValue } = useContext(GlobalContext);
  const fontID = 'algorithmTitle';
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const [share, setShare] = useState(false);
  const closeShare = () => setShare(false);
  const [explanation, setExplanation] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
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

  useEffect(() => {
    if (share) {
      let url = `${window.location.origin}/?alg=${algorithmKey}&mode=${mode}`
      
      if (category == 'Sort') {
        url += `&list=${nodes}`;
      } else if (category == 'Insert/Search') {
        url += `&list=${nodes}&value=${searchValue}`;
      } else if (category == 'String Search') {
        url += `&string=${nodes}&pattern=${searchValue}`;
      } 
      
      setCurrentUrl(url);
    }
  }, [share, algorithmKey, category, mode, searchValue]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
  };

  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div>
          <ControlButton icon={<HelpIcon />} onClick={() => setOpen((o) => !o)} />
          <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <div className="helpArea">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <a className="closeHelp" onClick={closeModal}>
                &times;
              </a>
              {/* eslint-disable-next-line max-len */}
              <ReactMarkDown source={explanation} escapeHtml={false} renderers={{ code: CodeBlock }} plugins={[toc]} />
            </div>
          </Popup>
        </div>

        <div>
          <ControlButton icon={< ShareIcon />} onClick={() => setShare((o) => !o)} />
          <Popup open={share} closeOnDocumentClick onClose={closeShare}>
            <div className="shareArea">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <a className="closeShare" onClick={closeShare}>
                &times;
              </a>
              {/* eslint-disable-next-line max-len */}
              <p> 
                {currentUrl}
              </p>
              <button onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
                Copy URL
              </button>
            </div>
          </Popup>
        </div>

        <div className="algorithmTitle" id={fontID}>{algorithm.name}</div>

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
