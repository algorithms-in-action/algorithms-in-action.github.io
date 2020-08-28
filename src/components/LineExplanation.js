import React, { useContext } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import { GlobalContext } from '../context/GlobalState';
import findBookmark from '../pseudocode/findBookmark';
import CodeBlock from '../markdown/code-block';

function LineExplanation() {
  const { algorithm } = useContext(GlobalContext);
  return (
    // TODO: to be removed when insertion explanation is ready
    algorithm.id === 'binaryTreeSearch'
      ? (
        <div className="lineExplanation">
          <ReactMarkDown
            source={findBookmark(algorithm.pseudocode, algorithm.bookmark).explanation}
            escapeHtml={false}
            renderers={{ code: CodeBlock }}
          />
        </div>
      )
      : null
  );
}

export default LineExplanation;
