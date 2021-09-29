import React, { useContext, useEffect, useState } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';

import PropTypes from 'prop-types';
import CodeBlock from '../../markdown/code-block';
import { GlobalContext } from '../../context/GlobalState';

import { increaseFontSize, setFontSize } from '../top/helper';


function Instruction({ fontSize, fontSizeIncrement }) {
  const { algorithm } = useContext(GlobalContext);
  const [explanation, setExplanation] = useState('');
  const fontID = 'textAreaExplanation';


  useEffect(() => {
    var text = '# Instructions \n\n\n';
    for(var i=0;i<algorithm.instructions.length;i++){
      text = text+"## "+algorithm.instructions[i].title+"\n\n\n";
      for(var j=0;j<algorithm.instructions[i].content.length;j++){
        text = text +(j+1)+".\t"+algorithm.instructions[i].content[j]+"\n\n";
      }
    }
    
    setExplanation(text);
    setFontSize(fontID, fontSize);
    increaseFontSize(fontID, fontSizeIncrement);
  }, [algorithm.instructions,fontSizeIncrement, fontSize]);


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

export default Instruction;
Instruction.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
};
