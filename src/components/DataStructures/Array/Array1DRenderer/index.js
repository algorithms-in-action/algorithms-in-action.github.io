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
import Array2DRenderer from '../Array2DRenderer/index';
import styles from './Array1DRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';
// Add your algo to this if you want to use the float box/popper
const ALGOS_USING_FLOAT_BOX = ["MSDRadixSort", "straightRadixSort"];
const STACK_GAP_PX = -50;

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

    this.maxStackDepth = 0;
  }

  // XXX "Warning: Each child in a list should have a unique "key" prop.
  // Check the render method of `Array1DRenderer`" ???
  renderData() {

    // listOfNumbers used for stack caption in msort_arr_td
    // eslint-disable-next-line
    const { data, algo, stack, stackDepth, listOfNumbers, columnGapAt, indexAfterGap } = this.props.data;

    const arrayMagnitudeScaleValue = 20; // value to scale an array e.g. so that the maximum item is 150px tall

    let longestRow = data.reduce(
      (longestRow, row) => (longestRow.length < row.length ? row : longestRow),
      [],
    );
    let largestColumnValue = 0;
    // if largestValue not set explicitly, compute it
    if (!this.props.data.largestValue) {
      largestColumnValue = data[0].reduce(
        (acc, curr) => (acc < curr.value ? curr.value : acc),
        0,
      );
    } else {
      largestColumnValue = this.props.data.largestValue;
    }
    // handle non-numbers by using minimum height
    let scaleY = ((largest, columnValue) =>
    (typeof columnValue !== "number" ? 0 :
      (columnValue / largest) * arrayMagnitudeScaleValue)).bind(
        null,
        largestColumnValue,
      );
    if (!this.props.data.arrayItemMagnitudes) {
      scaleY = () => 0;
    }
    // wrap output in table like 2D array so we can have a caption (for
    // msort_arr_td) XXX fix indentation
    return (
      <div>
      <table
        className={switchmode(mode())}
        style={{
          marginLeft: -this.centerX * 2,
          marginTop: -this.centerY * 2,
          transform: `scale(${this.zoom})`,
        }}
      >
        <tbody>
          <motion.div animate={{ scale: this.zoom }} className={switchmode(mode())}>
            {/* Values */}
            {data.map((row, i) => (
              <div
                className={styles.row}
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                {row.map((col, j) => (
                  <td className={classes(styles.col, styles.index)}
                    key={col.key}
                    onMouseEnter={(e) => {
                      let element = e.target.children[1];
                      if (element && element.innerHTML !== "") {
                        element.style.display = 'block'
                      }
                    }}
                    onMouseLeave={(e) => {
                      let element = e.target.children[1];
                      if (element && element.innerHTML !== "") {
                        element.style.display = 'none'
                      }
                    }}
                   >
                     <div
                        id={'chain_' + parseInt(j)}
                      >
                        <motion.div
                          layout
                          transition={{ duration: 0.6 }}
                          style={{
                            height: `${this.toString(scaleY(col.value))}vh`,
                            display: 'flex',
                            backgroundColor: col.color || undefined,
                          }}
                          /* eslint-disable-next-line react/jsx-props-no-multi-spaces */
                          className={classes(
                            (j === columnGapAt ? styles.columnGap : styles.col),
                            // styles.col,
                            col.faded && styles.faded,
                            col.selected && styles.selected,
                            col.selected1 && styles.selected1,
                            col.selected2 && styles.selected2,
                            col.selected3 && styles.selected3,
                            col.selected4 && styles.selected4,
                            col.selected5 && styles.selected5,
                            col.patched && styles.patched,
                            col.sorted && styles.sorted,
                            col.style && col.style.backgroundStyle,
                          )}
                        >
                          <motion.span
                            layout="position"
                            className={classes(
                              styles.value,
                              col.style && col.style.textStyle,
                            )}
                          >
                            {(j == columnGapAt ? ' '
                              : this.toString(col.value))}
                          </motion.span>
                        { (ALGOS_USING_FLOAT_BOX.includes(algo) && (
                            <div
                              id={"float_box_" + parseInt(j)}
                              role="tooltip"
                              style={{
                                background: '#333',
                                color: "#FFFFFF",
                                fontWeight: "bold",
                                padding: "4px 8px",
                                fontSize: "13px",
                                borderRadius: "4px",
                                display: "none",
                              }}
                            >
                            </div>
                          ))
                        }
                      </motion.div>
                    </div>
                  </td>
                ))}
              </div>
            ))}

            <div>
              {/* Indexes  XXX maybe avoid for arrayB in Merge sort? */}
              <div
                className={styles.row}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                {longestRow.map((_, i) => {
                  // the array index starts from 1 in most algorithms
                  // 0 for straightRadixSort (wanted for count array)
                  if (algo !== "straightRadixSort") {
                    i += 1;
                  }

                  return (
                    <div className={classes(styles.col, styles.index)} key={i}>
                      <span className={styles.value}>
                        {(i-1 == columnGapAt ? ' '
                          : i-1 == columnGapAt+1 ? indexAfterGap
                          : i
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Variable pointers */}
              {data.map(
                (
                  row,
                  i, // variable pointer only working for 1D arrays
                ) => (
                  <AnimateSharedLayout>
                    <div
                      layout
                      className={styles.row}
                      key={i}
                      style={{
                        minHeight: '0px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                      }}
                    >
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
            <div>
              {// Quicksort + MSD radix sort stuff
                stack && stack.length > 0 ? (
                  this.maxStackDepth = Math.max(this.maxStackDepth, stackDepth),
                  stackRenderer(stack, data[0].length, stackDepth, this.maxStackDepth, STACK_GAP_PX)
                ) : (
                  <div />
                )}
            </div>
          </motion.div>
        </tbody>
        { algo === 'msort_arr_td' && listOfNumbers && (
            <caption
              className={styles.simple_stack_caption}
              kth-tag="msort_arr_td_caption"
            > Call stack (left,right):&emsp; {listOfNumbers}&emsp;&emsp; </caption>)
        }
        {
          algo === 'msort_arr_bup' && listOfNumbers && (
            <caption
              className={styles.top_caption}
              kth-tag="msort_arr_bup_caption"
            > &emsp; {listOfNumbers}&emsp;&emsp; </caption>)
        }
        {
          algo === 'msort_arr_nat' && listOfNumbers && (
            <caption
              className={styles.top_caption}
              kth-tag="msort_arr_nat_caption"
            > &emsp; {listOfNumbers}&emsp;&emsp; </caption>)
        }
      </table>
      </div>
    );
  }
}

/**
 * @param {*} color_index - an integer representing the state of a stack element
 * @returns string
 */

function stackFrameColour(color_index) {
  return [
    'var(--not-started-section)', // 0
    'var(--in-progress-section)', // 1
    'var(--current-section)',     // 2
    'var(--finished-section)',    // 3
    'var(--i-section)',    // 4
    'var(--j-section)',    // 5
    'var(--p-section)',    // 6
    'var(--in-progress-sectionR)', // 7
    'var(--current-sectionR)',     // 8
    'var(--finished-sectionR)',    // 9
  ][color_index]
}

/**
 * Renders a stack which is fairly specific to Quicksort. That is, it matches position of array elements exactly.
 * It's purpose is to give a sense of the depth of the stack, plus illustrate the in-place nature of Quicksort.
 * @param {} stack
 * @param {*} nodeCount
 * @param {*} stackDepth
 * @returns
 */
function stackRenderer(stack, nodeCount, stackDepth, maxStackDepth, stackGapPx = 0) {
  if (!stack) {
    return <div />;
  }
  
  // Find the boundary information of the last row (bottom stack frame)
  let lastRowBoundaries = null;
  if (stack.length > 0) {
    const lastRow = stack[stack.length - 1];
    lastRowBoundaries = lastRow.map(item => ({
      isLeftBoundary: item.isLeftBoundary,
      isRightBoundary: item.isRightBoundary
    }));
  }
  
  let stackItems = [];
  for (let i = 0; i < stack.length; i += 1) {
    const isLastRow = (i === stack.length - 1);
    
    stackItems.push(
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {stack[i].map(({ base, extra, value, isLeftBoundary, isRightBoundary }, index) => {
          return (
            <div
              className={styles.stackElement}
              style={{
                width: `calc(100%/${nodeCount})`,
                minWidth: `calc(100%/${nodeCount})`,
                maxWidth: `calc(100%/${nodeCount})`,
                textAlign: 'center',
                color: 'gray',
                backgroundColor: stackFrameColour(base),
                boxSizing: 'border-box',
                // Add boundary styles
                borderLeft: isLeftBoundary ? '2px solid black' : 
                           (!isLastRow && lastRowBoundaries && lastRowBoundaries[index] && lastRowBoundaries[index].isLeftBoundary ? 
                            `2px solid ${stackFrameColour(base)}` : 'none'),
                borderRight: isRightBoundary ? '2px solid black' : 
                            (!isLastRow && lastRowBoundaries && lastRowBoundaries[index] && lastRowBoundaries[index].isRightBoundary ? 
                             `2px solid ${stackFrameColour(base)}` : 'none'),
              }}
            >
              {/* Display values */}
              {value !== undefined && (
                <span style={{ 
                  fontSize: '10px', 
                  color: 'white',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  {value}
                </span>
              )}
              
              {extra.map((extraColor) => (
                <div
                  className={styles.stackSubElement}
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: stackFrameColour(extraColor),
                  }}
                />
              ))}
            </div>
          );
        }
        )}
      </div>,
    );
  }


  /*

    Logic for maxStackDepth needs to be fixed before it can be added in again

    Bugs with
      maxStackDepth not being correct
      changing array and maxStackDepth staying the same

          <p>
          {stack.length > 0 && stackDepth !== undefined ? `Maximum stack depth: ${maxStackDepth}` : ''}
          </p>

      

  */

  return (
    <div className={styles.stack} style={{ marginTop: stackGapPx }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <p>
          {stack.length > 0 && stackDepth !== undefined ? `Current stack depth: ${stackDepth}` : ''}
        </p>

      </div>
      {stackItems}
    </div>
  );
}

/**
 * Stack Number Display Logic:
 * - This function determines if a number should be displayed in the stack visualization.
 * - The function is currently commented out as the feature is disabled. To re-enable:
 *   1. Uncomment this function.
 *   2. Uncomment the corresponding JSX where this function is called.
 *
 * @param {*} val
 * @param {*} index
 * @param {*} arr
 * @returns
 */
// function displayStackNumber(val, index, arr) {
//   if (val === 0) {
//     return false;
//   }
//   if (val === 1 && (arr[index - 1] !== 1 || arr[index + 1] !== 1)) {
//     return true;
//   }
//   if (val === -1 && (arr[index - 1] !== -1 || arr[index + 1] !== -1)) {
//     return true;
//   }
//   return false;
// }

export default Array1DRenderer;
