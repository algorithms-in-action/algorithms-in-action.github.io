import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkToc from 'remark-toc';

import PropTypes from 'prop-types';
import CodeBlock from '../../markdown/code-block';
import { GlobalContext } from '../../context/GlobalState';

import { increaseFontSize, setFontSize } from '../top/helper';

function Explanation({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const [explanation, setExplanation] = useState('');
  const fontID = 'textAreaExplanation';

  useEffect(() => {
    fetch(algorithm.explanation)
      .then((res) => res.text())
      .then((text) => setExplanation(text));

    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [algorithm.explanation, fontSizeIncrement, fontSize]);

  return (
    <div className="textArea" id={fontID}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkToc]}
        allowDangerousHtml={true}
        components={{
          code: CodeBlock,
        }}
      >
        {explanation}
      </ReactMarkdown>
    </div>
  );
}

export default Explanation;

Explanation.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
