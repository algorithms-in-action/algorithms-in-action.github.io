import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/order
import { GlobalContext } from '../../context/GlobalState';
import '../../styles/MidPanel.scss';
/* eslint-disable-next-line import/no-named-as-default */
import Popup from 'reactjs-popup';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkToc from 'remark-toc';
import HelpIcon from '@mui/icons-material/Help';
import CodeBlock from '../../markdown/code-block';
import { increaseFontSize, setFontSize } from '../top/helper';
import ControlButton from '../common/ControlButton';
import ShareIcon from '@mui/icons-material/Share';
import { URLContext } from '../../context/urlState';
import { createUrl } from './urlCreator';

function MidPanel({ fontSize, fontSizeIncrement }) {
  const { algorithm, algorithmKey, category, mode } = useContext(GlobalContext);
  const urlContext = useContext(URLContext);
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
    // this creates the url of the current algorithm, with required parameters
    if (share) {
      let baseUrl = `${window.location.origin}/animation/?alg=${algorithmKey}&mode=${mode}`;
      let url = createUrl(baseUrl, category, urlContext);

      // Step and expand apply to all algorithms append them on.
      if (algorithm?.chunker?.currentChunk) url += `&step=${algorithm.chunker.currentChunk}`;
      if (algorithm?.collapse?.[algorithmKey]) url += `&expand=${JSON.stringify(algorithm.collapse[algorithmKey])}`;
      setCurrentUrl(url);
    }
  }, [share]);

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
              <button className="closeHelp" onClick={closeModal}>
                &times;
              </button>
              {/* eslint-disable-next-line max-len */}
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkToc]}
                components={{ code: CodeBlock }}
              >
                {explanation}
              </ReactMarkdown>
            </div>
          </Popup>
        </div>

        <div>
          <ControlButton icon={<ShareIcon />} onClick={() => setShare((o) => !o)} />
          <Popup open={share} closeOnDocumentClick onClose={closeShare}>
            <div className="shareArea">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <button className="closeShare" onClick={closeShare}>
                &times;
              </button>
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
