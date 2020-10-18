import React, { useContext, useEffect, useState } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';

import PropTypes from 'prop-types';
import CodeBlock from '../../markdown/code-block';
import { GlobalContext } from '../../context/GlobalState';

import { increaseFontSize, setFontSize } from '../top/helper';


function Explanation({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const [explanation, setExplanation] = useState('');
  const fontID = 'textAreaExplanation';


  useEffect(() => {
    fetch(algorithm.explanation).then((res) => res.text()).then((text) => setExplanation(text));
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [algorithm.explanation, fontSizeIncrement, fontSize]);


  return (
    <div className="textArea" id={fontID}>
      <ReactMarkDown
        source={explanation}
        escapeHtml={false}
        renderers={{ code: CodeBlock }}
        plugins={[toc]}
      />
    </div>
  );
}

export default Explanation;
Explanation.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
