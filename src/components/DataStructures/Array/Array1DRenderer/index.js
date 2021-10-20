/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-cycle */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-mixed-operators */
/* eslint-disable arrow-parens */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */

import React from 'react';
// import Array1DRenderer from '../Array1DRenderer/index';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Array2DRenderer, { } from '../Array2DRenderer/index';
import styles from './Array1DRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';


let modename;
function switchmode(modetype = mode()) {
  switch (modetype) {
    case 1:
      modename = styles.array_1d_green;
      break;
    case 2:
      modename = styles.array_1d_blue;
      break;
    default:
      modename = styles.array_1d;
  }
  return modename;
}


class Array1DRenderer extends Array2DRenderer {
  constructor(props) {
    super(props);

    this.togglePan(true);
    this.toggleZoom(true);
  }

  renderData() {
    const { data, algo, stack, stackDepth } = this.props.data;

    const arrayMagnitudeScaleValue = 20; // value to scale an array e.g. so that the maximum item is 150px tall

    let longestRow = data.reduce((longestRow, row) => longestRow.length < row.length ? row : longestRow, []);
    let largestColumnValue = data[0].reduce((acc, curr) => (acc < curr.value ? curr.value : acc), 0);
    let scaleY = ((largest, columnValue) => columnValue / largest * arrayMagnitudeScaleValue).bind(null, largestColumnValue);
    if (!this.props.data.arrayItemMagnitudes) {
      scaleY = () => 0;
    }
    return (
    <motion.div
    animate={{ scale: this.zoom }}
    className={switchmode(mode())}
    >

        {/* Values */}
        {data.map((row, i) => (
                <div className={styles.row} key={i} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                {row.filter((col) => col.variables.includes('pivot')).map((col)=><div className={styles.pivotLine} style={{
                  bottom: `max(var(--array-1d-minimum-height), ${this.toString(scaleY(col.value))}vh)`}}/>)}
            {row.map((col) => (
            <motion.div
                layout
                transition={{ duration: 0.6 }}
                style={{
                  height: `${this.toString(scaleY(col.value))}vh`,
                  display: 'flex',
                }}

                /* eslint-disable-next-line react/jsx-props-no-multi-spaces */
                className={classes(
                  styles.col,
                  col.faded && styles.faded,
                  col.selected && styles.selected,
                  col.patched && styles.patched,
                  col.sorted && styles.sorted,
                  col.style && col.style.backgroundStyle,
                )}
                key={col.key}
            >
               <motion.span layout="position" className={classes(
                 styles.value,
                 col.style && col.style.textStyle,
               )}>
                {this.toString(col.value)}
                </motion.span>

            </motion.div>
            ))}
        </div>
        ))}

<div>
        {/* Indexes */}
        <div className={styles.row} style={{ display: 'flex', justifyContent: 'space-between' }}>
        {longestRow.map((_, i) => {
          // if the graph instance is heapsort, then the array index starts from 1
          if (algo === 'heapsort') {
            i += 1;
          }
          return (
                    <div className={classes(styles.col, styles.index)} key={i}>
                    <span className={styles.value}>{i}</span>
                    </div>
          );
        })}
        </div>

        {/* Variable pointers */}
        {data.map(
          (row, i) => ( // variable pointer only working for 1D arrays
            <AnimateSharedLayout>
                <div layout className={styles.row} key={i} style={{ minHeight: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>

                {row.map((col) => (
                    <div
                    className={classes(styles.col, styles.variables)}
                    key={`vars-${col.key}`}
                    >
                    {col.variables.map((v) => (
                        <motion.div
                        layoutId={v}
                        key={v}
                        className={styles.variable}
                        style={{ fontSize: v.length > 2 ? '12px' : null }}
                        >
                        {v}
                        </motion.div>
                    ))}
                    </div>
                ))}
                </div>
            </AnimateSharedLayout>
          ),
        )}
        </div>
        <div>{ stack && stack.length > 0 ? stackRenderer(stack, data[0].length, stackDepth) : <div /> }</div>
    </motion.div>
    );
  }
}

/**
 * @param {*} stackElementValue - an integer representing the state of a stack element
 * @returns string
 */
 function stackFrameColour(stackElementValue) {
  switch (stackElementValue) {
    case 0: return 'var(--completed-stack-section)';
    case 1: return 'var(--active-stack-section)';
    case -1: return 'var(--future-stack-section)';
    default: return '';
  }
}

/**
 * Renders a stack which is fairly specific to Quicksort. That is, it matches position of array elements exactly.
 * It's purpose is to give a sense of the depth of the stack, plus illustrate the in-place nature of Quicksort.
 * @param {} stack 
 * @param {*} nodeCount 
 * @param {*} stackDepth 
 * @returns 
 */
function stackRenderer(stack, nodeCount, stackDepth) {
  if (!stack) {
    return <div />;
  }
  let stackItems = [];
  for (let i = 0; i < stack.length; i += 1) {
    stackItems.push(
      <div style={{ display: 'flex',
        justifyContent: 'space-between' }}>
                    {stack[i].map((val, index) => <div className={styles.stackElement} style={{
                      width: `calc(100%/${nodeCount})`,
                      textAlign: 'center',
                      color: 'gray',
                      backgroundColor: stackFrameColour(val) }}>{
                      (() => {
                        if (displayStackNumber(val, index, stack[i])) {
                          return <p style={{fontSize: '13px'}}>{index}</p>;
                        }
                        return '';
                      })()
                      }</div>)}
  </div>,
    );
  }
  return (<div className={styles.stack}>
            <p>{stack.length > 0 && stackDepth !== undefined ? `Current stack depth: ${stackDepth + 1}` : ''}</p>
            {stackItems}
          </div>);
}

/**
 * NOTE: this should certainly be rewritten. Time constraints mean that this is a
 * fairly quick and dirty solution, however visually it shows the stack that the clients wanted.
 * For the sake of future development, certainly think about changing this.
 * @param {*} val 
 * @param {*} index 
 * @param {*} arr 
 * @returns 
 */
function displayStackNumber(val, index, arr) {
  if(val === 0) {
    return false;
  }
  if(val === 1 && (arr[index-1]!==1 || arr[index+1]!==1)) {
    return true;
  }
  if(val === -1 && (arr[index-1] !== -1 || arr[index+1] !== -1)) {
    return true;
  }


  return false;
}


export default Array1DRenderer;
