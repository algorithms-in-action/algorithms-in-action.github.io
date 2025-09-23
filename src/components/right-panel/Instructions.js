import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkToc from 'remark-toc';

import PropTypes from 'prop-types';
import CodeBlock from '../../markdown/code-block';
import { GlobalContext } from '../../context/GlobalState';

import { increaseFontSize, setFontSize } from '../top/helper';

function Instruction({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const [explanation, setExplanation] = useState('');
  const fontID = 'textAreaExplanation';

  useEffect(() => {
    let text = '# Instructions \n\n\n';
    for (let i = 0; i < algorithm.instructions.length; i++) {
      text += `## ${algorithm.instructions[i].title}\n\n\n`;
      for (let j = 0; j < algorithm.instructions[i].content.length; j++) {
        text += `${j + 1}.\t${algorithm.instructions[i].content[j]}\n\n`;
      }
    }

    setExplanation(text);
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [algorithm.instructions, fontSizeIncrement, fontSize]);

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

export default Instruction;

Instruction.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
