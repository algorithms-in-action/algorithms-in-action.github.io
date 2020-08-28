import React, { useContext, useEffect, useState } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';

import CodeBlock from '../../markdown/code-block';
import { GlobalContext } from '../../context/GlobalState';

function MoreInfo() {
  const { algorithm } = useContext(GlobalContext);
  const [info, setInfo] = useState('');

  useEffect(() => {
    fetch(algorithm.moreInfo).then((res) => res.text()).then((text) => setInfo(text));
  }, [algorithm.moreInfo]);

  console.log('HERELOL');
  console.log(algorithm);

  return (
    <div className="textArea">
      <ReactMarkDown
        source={info}
        escapeHtml={false}
        renderers={{ code: CodeBlock }}
        plugins={[toc]}
      />
    </div>
  );
}

export default MoreInfo;
