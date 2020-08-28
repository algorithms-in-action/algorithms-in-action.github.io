import React, { useContext, useEffect, useState } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';

import CodeBlock from '../../markdown/code-block';
import { GlobalContext } from '../../context/GlobalState';

function MoreInfo() {
  const { algorithm } = useContext(GlobalContext);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    fetch(algorithm.extraInfo).then((res) => res.text()).then((text) => setExplanation(text));
  }, [algorithm.extraInfo]);

  return (
    <div className="textArea">
      <ReactMarkDown
        source={explanation}
        escapeHtml={false}
        renderers={{ code: CodeBlock }}
        plugins={[toc]}
      />
    </div>
  );
}

export default MoreInfo;
