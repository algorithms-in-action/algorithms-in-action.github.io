/* eslint-disable quote-props */
/* eslint-disable no-undef */
import React from 'react';
import { Global } from './LineNumHighLight';


const codeLines1 = {
  'procedure BinaryTreeSearch(needle):': '1', 'doSomething': '2', 'doSomethingElse': '3', 'moreStuff': '4'};
const currentBookMark= '2';


describe('LineNumHighLight', () => {
  it('Check paintCodeLine', () => {
    const paintCodeLine = Global.PAINT_CODELINE(codeLines1, currentBookMark);
    expect(paintCodeLine).toContainEqual(
      <p
        key={1}
            // eslint-disable-next-line react/destructuring-assignment
        className="active"
        index={1}
        role="presentation"
      >
        <span>{2}</span>
        <span>doSomething</span>
      </p>,
    );
  });
});
