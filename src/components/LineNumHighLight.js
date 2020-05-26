/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import '../styles/LineNumHighLight.css';

const LineNumHighLight = () => {
  const lineOfCode = [
    'procedure BinaryTreeSearch(Tree, Item):',
    'Ptr = Root;',
    'while (Ptr Not Null)',
    'if(Ptr->Key == Item)',
    ' return FOUND ',
    'else ',
    'if(DataItem < Ptr->Key)',
    'Ptr = Ptr->lchild ',
    'else',
    'Ptr = Ptr->rchild  ',
    'procedure BinaryTreeSearch(Tree, Item):',
    'Ptr = Root;',
    'while (Ptr Not Null)',
    'if(Ptr->Key == Item)',
    ' return FOUND ',
    'else ',
    'if(DataItem < Ptr->Key)',
    'Ptr = Ptr->lchild ',
    'else',
    'Ptr = Ptr->rchild  ',
    '*******************Repeat**************************',
    'procedure BinaryTreeSearch(Tree, Item):',
    'Ptr = Root;',
    'while (Ptr Not Null)',
    'if(Ptr->Key == Item)',
    ' return FOUND ',
    'else ',
    'if(DataItem < Ptr->Key)',
    'Ptr = Ptr->lchild ',
    'else',
    'Ptr = Ptr->rchild  ',
    'procedure BinaryTreeSearch(Tree, Item):',
    'Ptr = Root;',
    'while (Ptr Not Null)',
    'if(Ptr->Key == Item)',
    ' return FOUND ',
    'else ',
    'if(DataItem < Ptr->Key)',
    'Ptr = Ptr->lchild ',
    'else',
    'Ptr = Ptr->rchild  ',
  ];
  const [currentIndex, setCurrentIndex] = useState(-1);
  const highlightClick = (e) => {
    setCurrentIndex(parseInt(e.currentTarget.getAttribute('index'), 10));
  };
  const stepClick = () => {
    setCurrentIndex(parseInt(currentIndex + 1, 10));
  };

  /* render data */
  const paintCodeLine = (lineOfCode1) => {
    const codeLines = [];
    for (let i = 0; i < lineOfCode1.length; i += 1) {
      codeLines.push(
        <p
          key={i}
          // eslint-disable-next-line react/destructuring-assignment
          className={currentIndex === i ? 'active' : ''}
          index={i}
          onClick={highlightClick}
          role="presentation"
        >
          <span>{i + 1}</span>
          <span>{lineOfCode1[i]}</span>
        </p>,
      );
    }
    return codeLines;
  };

  return (
    <div className="line-light">
      <div className="code-container">
        <button
            // className={currentIndex === 0 ? 'active' : ''}
          type="button"
          value="stepbystep"
          onClick={stepClick}
        >
          StepByStep
        </button>
        {paintCodeLine(lineOfCode)}
      </div>
    </div>
  );
};
export default LineNumHighLight;
