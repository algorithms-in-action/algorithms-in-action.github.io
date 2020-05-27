import React, { useContext } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';
// eslint-disable-next-line import/named
import { GlobalContext } from '../context/GlobalState';
import CodeBlock from '../markdown/code-block';


function Explanation() {
  const { algorithm } = useContext(GlobalContext);

  return (
    <div className="textArea">
      <ReactMarkDown
        source={algorithm.text}
        escapeHtml={false}
        renderers={{ code: CodeBlock }}
        plugins={[toc]}
      />
    </div>
  );
}

export default Explanation;
