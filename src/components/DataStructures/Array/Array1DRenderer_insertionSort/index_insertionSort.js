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
import { motion, AnimateSharedLayout } from 'framer-motion';
import Array2DRenderer from '../Array2DRenderer/index';
import styles from './Array1DRenderer_insertionSort.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';

const ALGOS_USING_FLOAT_BOX = ['MSDRadixSort', 'straightRadixSort'];

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

    this.columnGapAt = undefined;
    this.indexAfterGap = 'temp';
  }

  renderData() {
    // eslint-disable-next-line
    const { data, algo, stack, stackDepth, listOfNumbers } = this.props.data;

    const arrayMagnitudeScaleValue = 20;


    const gapIndices =
      data && data[0]
        ? data[0]
            .map((el, idx) => {
              const v =
                el && typeof el === 'object' ? el.value : el;
              return v == null ? idx : -1;
            })
            .filter((idx) => idx !== -1)
        : [];

    const totalCols = data && data[0] ? data[0].length : 0;
    const tempIndex = totalCols > 0 ? totalCols - 1 : -1;
    const spacerIndex = totalCols > 1 ? totalCols - 2 : -1;

    let longestRow = data.reduce(
      (longestRow, row) => (longestRow.length < row.length ? row : longestRow),
      [],
    );

    let largestColumnValue = 0;
    if (!this.props.data.largestValue) {
      largestColumnValue = (data[0] || []).reduce(
        (acc, curr) => {
          const v = (curr && typeof curr === 'object') ? curr.value : curr;
          return (typeof v === 'number' && acc < v) ? v : acc;
        },
        0,
      );
    } else {
      largestColumnValue = this.props.data.largestValue;
    }

    let scaleY = ((largest, columnValue) =>
      (typeof columnValue !== 'number' ? 0 :
        (columnValue / (largest || 1)) * arrayMagnitudeScaleValue)).bind(
      null,
      largestColumnValue,
    );
    if (!this.props.data.arrayItemMagnitudes) {
      scaleY = () => 0;
    }

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
                  {row.map((col, j) => {
                    const value = (col && typeof col === 'object') ? col.value : col;
                    const isGap = gapIndices.includes(j);

                    return (
                      <td
                        key={(col && col.key) ? col.key : `col-${j}`}
                        className={isGap ? styles.index : classes(styles.col, styles.index)}
                        style={
                          isGap
                            ? {
                                border: 'none',
                                background: 'transparent',
                                padding: 0,
                                margin: 0,
                              }
                            : undefined
                        }
                      >
                        <div id={'chain_' + parseInt(j, 10)}>
                          <motion.div
                            layout
                            transition={{ duration: 0.6 }}
                            style={{
                              height: `${this.toString(scaleY(value))}vh`,
                              display: 'flex',
                            }}
                            className={classes(
                              isGap ? styles.columnGap : styles.col,
                              col && col.faded && styles.faded,
                              col && col.selected && styles.selected,
                              col && col.selected1 && styles.selected1,
                              col && col.selected2 && styles.selected2,
                              col && col.selected3 && styles.selected3,
                              col && col.selected4 && styles.selected4,
                              col && col.selected5 && styles.selected5,
                              col && col.patched && styles.patched,
                              col && col.sorted && styles.sorted,
                              col && col.style && col.style.backgroundStyle,
                            )}
                          >
                            <motion.span
                              layout="position"
                              className={classes(
                                styles.value,
                                col && col.style && col.style.textStyle,
                              )}
                            >

                              {isGap ? ' ' : this.toString(value)}
                            </motion.span>

                            {ALGOS_USING_FLOAT_BOX.includes(algo) && (
                              <div
                                id={'float_box_' + parseInt(j, 10)}
                                role="tooltip"
                                style={{
                                  background: '#333',
                                  color: '#FFFFFF',
                                  fontWeight: 'bold',
                                  padding: '4px 8px',
                                  fontSize: '13px',
                                  borderRadius: '4px',
                                  display: 'none',
                                }}
                              />
                            )}
                          </motion.div>
                        </div>
                      </td>
                    );
                  })}
                </div>
              ))}

              <div
                className={styles.row}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                {(() => {
                  const items = [];
                  const total = longestRow.length;
                  const N = Math.max(0, total - 2);

                  // 1..N
                  for (let k = 1; k <= N; k++) {
                    items.push(
                      <div key={`idx-${k}`} className={classes(styles.col, styles.index)}>
                        <span className={styles.value}>{k}</span>
                      </div>
                    );
                  }

                  if (spacerIndex >= 0) {
                    items.push(
                      <div
                        key="idx-blank"
                        className={classes(styles.col, styles.index)}
                        style={{ background: 'transparent', border: 'none' }}
                      >
                        <span className={styles.value} style={{ visibility: 'hidden' }}>
                          _
                        </span>
                      </div>
                    );
                  }

                  // temp
                  items.push(
                    <div key="idx-temp" className={classes(styles.col, styles.index)}>
                      <span className={styles.value}>temp</span>
                    </div>
                  );

                  return items;
                })()}
              </div>

              {data.map((row, i) => (
                <AnimateSharedLayout key={`vars-row-${i}`}>
                  <div
                    layout
                    className={styles.row}
                    style={{
                      minHeight: '50px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    {row.map((col, j) => (
                      <div
                        className={classes(styles.col, styles.variables)}
                        key={`vars-${(col && col.key) ? col.key : `c-${j}`}`}
                      >
                        {(col && col.variables ? col.variables : []).map((v) => (
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
              ))}

              <div>
                {stack && stack.length > 0
                  ? (this.maxStackDepth = Math.max(this.maxStackDepth, stackDepth),
                    stackRenderer(stack, (data[0] || []).length, stackDepth, this.maxStackDepth))
                  : (<div />)}
              </div>
            </motion.div>
          </tbody>

          {algo === 'msort_arr_td' && listOfNumbers && (
            <caption
              className={styles.simple_stack_caption}
              kth-tag="msort_arr_td_caption"
            >
              {' '}
              Call stack (left,right):&emsp; {listOfNumbers}&emsp;&emsp;{' '}
            </caption>
          )}
          {algo === 'msort_arr_bup' && listOfNumbers && (
            <caption
              className={styles.top_caption}
              kth-tag="msort_arr_bup_caption"
            >
              {' '}
              &emsp; {listOfNumbers}&emsp;&emsp;{' '}
            </caption>
          )}
          {algo === 'msort_arr_nat' && listOfNumbers && (
            <caption
              className={styles.top_caption}
              kth-tag="msort_arr_nat_caption"
            >
              {' '}
              &emsp; {listOfNumbers}&emsp;&emsp;{' '}
            </caption>
          )}
        </table>
      </div>
    );
  }
}

function stackFrameColour(color_index) {
  return [
    'var(--not-started-section)', // 0
    'var(--in-progress-section)', // 1
    'var(--current-section)',     // 2
    'var(--finished-section)',    // 3
    'var(--i-section)',           // 4
    'var(--j-section)',           // 5
    'var(--p-section)',           // 6
    'var(--in-progress-sectionR)', // 7
    'var(--current-sectionR)',     // 8
    'var(--finished-sectionR)',    // 9
  ][color_index];
}

function stackRenderer(stack, nodeCount, stackDepth, maxStackDepth) {
  if (!stack) return <div />;

  const stackItems = [];
  for (let i = 0; i < stack.length; i += 1) {
    stackItems.push(
      <div style={{ display: 'flex', justifyContent: 'space-between' }} key={`stack-${i}`}>
        {stack[i].map(({ base, extra }, index) => (
          <div
            key={`stack-el-${i}-${index}`}
            className={styles.stackElement}
            style={{
              width: `calc(100%/${nodeCount})`,
              textAlign: 'center',
              color: 'gray',
              backgroundColor: stackFrameColour(base),
            }}
          >
            {extra.map((extraColor, k) => (
              <div
                key={`stack-sub-${i}-${index}-${k}`}
                className={styles.stackSubElement}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: stackFrameColour(extraColor),
                }}
              />
            ))}
          </div>
        ))}
      </div>,
    );
  }

  return (
    <div className={styles.stack}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <p>
          {stack.length > 0 && stackDepth !== undefined
            ? `Current stack depth: ${stackDepth}`
            : ''}
        </p>
      </div>
      {stackItems}
    </div>
  );
}

export default Array1DRenderer;





