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

import React, { useRef, useEffect } from 'react';
// import Array1DRenderer from '../Array1DRenderer/index';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import styles from './Array2DRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';
import PropTypes from 'prop-types';

// Add your algo to this if you want to use the float box/popper
const ALGOS_USING_FLOAT_BOX = ["HashingCH"];
// Add your algo to this if your algo has the first column as the headers
const ALGOS_WITH_FIRST_COL_AS_HEADERS = ["HashingCH", "HashingLP", "HashingDH"];

let modename;
export function switchmode(modetype = mode()) {
  switch (modetype) {
    case 1:
      modename = styles.array_2d_green;
      break;
    case 2:
      modename = styles.array_2d_blue;
      break;
    default:
      modename = styles.array_2d;
  }
  return modename;
}

const useScroll = () => {
  const elRef = useRef(null);
  const executeScroll = () => elRef.current.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  return [executeScroll, elRef];
};

const ScrollToHighlight = ({col, j, toString}) => {
  const [executeScroll, elRef] = useScroll();
  useEffect(executeScroll, []);

  return (
    <td
      className={classes(
        styles.col,
        col.selected && styles.selected,
        col.patched && styles.patched,
        col.sorted && styles.sorted,
        col.selected1 && styles.selected1,
        col.selected2 && styles.selected2,
        col.selected3 && styles.selected3,
        col.selected4 && styles.selected4,
        col.selected5 && styles.selected5,
        styles.variableOrange,
      )}
      key={j}
      ref={elRef}
    >
      <span className={styles.value}>
        {toString(col.value)}
      </span>
    </td>
  );
}

ScrollToHighlight.propTypes = {
  col: PropTypes.object.isRequired,
  j: PropTypes.number.isRequired,
}

const handleMouseEnter = (id) => {
  console.log(id);
}

class Array2DRenderer extends Renderer {
  constructor(props) {
    super(props);

    this.togglePan(true);
    this.toggleZoom(true);
  }

  renderData() {
    // For DFSrec+msort_arr_td,... listOfNumbers is actually a list of
    // pairs of numbers, or strings such as '(2,5)'
    const {
      data,
      algo,
      kth,
      listOfNumbers,
      motionOn,
      hideArrayAtIdx,
      splitArray,
      highlightRow,
      // newZoom,
    } = this.props.data;
    let centerX = this.centerX;
    let centerY = this.centerY;
    let zoom = this.zoom;

    // // Change Renderer's zoom on newZoom change
    // if (newZoom != this.zoom && newZoom !== undefined) {
    //   this.zoom = newZoom;
    //   this.refresh();
    // }

    const isArray1D = true;
    let render = [];
    // eslint-disable-next-line camelcase
    let data_T;
    if (algo === 'tc') {
      // eslint-disable-next-line camelcase
      data_T = data[0].map((col, i) => data.map((row) => row[i]));
    }
    // const isArray1D = this instanceof Array1DRenderer;

    // These are for setting up the floating boxes
    const firstColIsHeaders = ALGOS_WITH_FIRST_COL_AS_HEADERS.includes(algo);

    // XXX sometimes caption (listOfNumbers) is longer than any row...
    function createArray(data, toString, longestRow, currentSub, subArrayNum) {
      return (
        <tbody>
        {algo === 'unionFind' && ( // adding the array indicies for union find
          <AnimateSharedLayout>
            <tr>
              {data[0].map((col, idx) => (
                <td key={idx}>
                  <div
                    style={{
                      position: 'absolute',
                      height: '15px',
                      width: '37px',
                    }}
                  >
                  {col.variables.map((v) => (
                    <motion.div
                      layoutId={v}
                      key={v}
                      className={classes(
                        styles.variable,
                        styles.top_variable
                    )}
                    transition={
                      motionOn ? { type: 'tween' } : { duration: 0 }
                    }
                    >
                      {v}
                    </motion.div>
                  ))}
                  </div>
                </td>
              ))}
            </tr>
          </AnimateSharedLayout>
        )}

        <tr className={styles.row}
          style={{
            height: (
              subArrayNum > 1 &&
              (algo === 'HashingLP' || algo === 'HashingDH' || algo === 'HashingCH')
            ) ? 5 : styles.row.height
          }}
        >
          {!isArray1D && <td className={classes(styles.col, styles.index)} />}
          {algo === 'tc' && ( // Leave a blank cell at the header row
            <td />
          )}
          { /* XXX really should have a displayIndex flag for */
            algo !== 'BFS' &&
            algo !== 'DFSrec' &&
            algo !== 'DFS' &&
            algo !== 'kruskal' &&
            algo !== 'dijkstra' &&
            algo !== 'aStar' &&
            algo !== 'aStar' &&
            algo !== 'msort_lista_td' &&
            algo !== 'HashingLP' &&
            algo !== 'HashingDH' &&
            algo !== 'HashingCH' &&
            longestRow.map((_, i) => {
              if (algo === 'tc') {
                i += 1;
              }
              if (algo === 'prim' || algo == 'unionFind') {
                return <React.Fragment key={i} />;
              }
              return (
                <th className={classes(styles.col, styles.index)} key={i}>
                  <span className={styles.value}>{i}</span>
                </th>
              );
            })
          }
        </tr>
        {data.map((row, i) => {
          let pointer = false;

          if (
            (Array.isArray(hideArrayAtIdx) && hideArrayAtIdx.includes(i))
            || (i === hideArrayAtIdx)
          ) return null;

          // eslint-disable-next-line no-plusplus
          for (let j = 0; j < row.length; j++) {
            if (row[j].selected) {
              pointer = true;
            }
          }
          return (
            <tr className={styles.row} key={i}>
              {algo === 'tc' && ( // generate vertical index, which starts from 1
                <th className={classes(styles.col, styles.index)} key={i}>
                  <span className={styles.value}>{i + 1}</span>
                </th>
              )}
              {!isArray1D && algo !== 'tc' && (
                <td className={classes(styles.col, styles.index)}>
                  <span className={styles.value}>{i}</span>
                </td>
              )}
              {row.map((col, j) => {
                const varGreen = col.fill === 1; // for simple fill
                const varOrange = col.fill === 2;
                const varRed = col.fill === 3;

                if (varOrange) {
                  return (
                    <ScrollToHighlight col={col} j={j} toString={toString} />
                  );
                }

                return (
                  <td
                  className={classes(
                    styles.col,
                    (i === highlightRow) && styles.highlightRow,
                    col.selected && styles.selected,
                    col.patched && styles.patched,
                    col.sorted && styles.sorted,
                    col.selected1 && styles.selected1,
                    col.selected2 && styles.selected2,
                    col.selected3 && styles.selected3,
                    col.selected4 && styles.selected4,
                    col.selected5 && styles.selected5,
                    varGreen && styles.variableGreen,
                    varOrange && styles.variableOrange,
                    varRed && styles.variableRed,
                  )}
                  key={j}
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
                      id={'chain_' + (parseInt(j) + parseInt(row.length * currentSub) - (firstColIsHeaders ? currentSub + 1 : 0))}
                    >
                      <span className={styles.value}>
                        {toString(col.value)}
                      </span>
                    </div>
                    {
                      (i == 1 && ALGOS_USING_FLOAT_BOX.includes(algo) && (!(firstColIsHeaders && j == 0)) && (
                        <div
                          id={"float_box_" + (parseInt(j) + parseInt(row.length * currentSub) - (firstColIsHeaders ? currentSub + 1 : 0))}
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
                  </td>
                );
              })
            }
            {
              (pointer && algo === 'tc' && (
                <th className={classes(styles.col, styles.index)}>
                  <span className={styles.value}> i </span>
                </th>
              ))
              ||
              (algo === 'aStar' && i === 1 && (
                <th className={classes(styles.col, styles.index)}>
                  <span className={styles.value}> )Priority </span>
                </th>
              ))
              ||
              (algo === 'aStar' && i === 2 && (
                <th className={classes(styles.col, styles.index)}>
                  <span className={styles.value}> )Queue&ensp; </span>
                </th>
              ))
              ||
              (((algo === 'prim' && i === 2) ||
                (algo === 'dijkstra' && i === 2)
              ) && (
                <th className={classes(styles.col, styles.index)}>
                  <span className={styles.value}> Priority Queue </span>
                </th>
              ))
              || <td className={classes(styles.col, styles.index)} />}
            </tr>
          );
        })}
        {algo === 'tc' && (
          // Don't remove "j-tag='transitive_closure'"
          <tr j-tag="transitive_closure" className={styles.row}>
          <td />
            {data_T.map((row) => {
              let pointer = false;
              // eslint-disable-next-line no-plusplus
              for (let j = 0; j < row.length; j++) {
                if (row[j].selected1) {
                  pointer = true;
                }
              }
              return (
                (pointer && (
                  <th className={classes(styles.col, styles.index)}>
                    <span className={styles.value}> j </span>
                  </th>
                )) || <td className={classes(styles.col, styles.index)} />
              );
            })}
          </tr>
        )}
        {(algo === 'prim' ||
          algo === 'kruskal' ||
          algo === 'dijkstra' ||
          algo === 'aStar' ||
          algo === 'DFS' ||
          algo === 'DFSrec' ||
          algo === 'msort_lista_td' ||
          algo === 'BFS' ||
          algo === 'HashingLP' ||
          algo === 'HashingDH' ||
          algo === 'HashingCH') &&
          data.map(
            (row, i) =>
            i === 2 && (
              <AnimateSharedLayout>
                <tr layout className={styles.row} key={i}>
                  {row.map((col, j) => (
                    <td
                      className={classes(styles.col, styles.variables)}
                      key={j}
                    >
                      {col.variables.map((v) => (
                        <motion.p
                          layoutId={v}
                          key={v}
                          className={styles.variable}
                        >
                          {v}
                        </motion.p>
                      ))}
                    </td>
                  ))}
                </tr>
              </AnimateSharedLayout>
            )
          )}
        </tbody>
      )
    }

    function createRender(render) {
      return (
        <table
          className={switchmode(mode())}
          style={{
            marginLeft: -centerX * 2,
            marginTop: -centerY * 2,
            transform: `scale(${zoom})`,
          }}
        >
          {render}
          {algo === 'tc' && (
            <caption kth-tag="transitive_closure">k = {kth}</caption>
          )}
          {algo == 'unionFind' && ( // bottom centre caption for union find
            <caption kth-tag="unionFind" className={styles.bottom_caption}>
              <span className={styles.pseudocode_function}>Union</span>({kth})
            </caption>
          )}
          {algo === 'DFS' && (
            <caption
              className={algo === 'DFS' ? styles.captionDFS : ''}
              kth-tag="dfs_caption"
            >
               Nodes (stack):&emsp; {listOfNumbers}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            </caption>
          )}
          {algo === 'DFSrec' && (
            <caption
              className={algo === 'DFSrec' ? styles.captionDFSrec : ''}
              kth-tag="dfsrec_caption"
            >
               Call stack (n,p):&emsp; {listOfNumbers}&emsp;&emsp;
            </caption>
          )}
          {algo === 'msort_lista_td' && listOfNumbers && (
            <caption
              className={algo === 'msort_lista_td' ?  styles.captionmsort_lista_td : ''}
              kth-tag="msort_lista_td_caption"
            >
               Call stack (L, len):&emsp; {listOfNumbers}&emsp;&emsp;
            </caption>
          )}
          {algo === 'BFS' && (
            <caption
              className={algo === 'BFS' ? styles.captionBFS : ''}
              kth-tag="bfs_caption"
            >
              Nodes (queue): {listOfNumbers}
            </caption>
          )}
        </table>
      )
    }

    if (!splitArray.doSplit) {
      let longestRow = data.reduce(
        (longestRow, row) => (longestRow.length < row.length ? row : longestRow),
        []
      );
      render.push(createArray(data, this.toString, longestRow));
      return createRender(render);

    } else {
      for (let i = 0; i < data.length; i++) {
        let longestRow = data[i].reduce(
          (longestRow, row) => (longestRow.length < row.length ? row : longestRow),
          []
        );
        render.push(createArray(
          data[i],
          this.toString,
          longestRow,
          i,
          data.length
        ));
      }

      return (
        <div
          id="popper_boundary"
          className={styles.container}
        >
          <div
            className={styles.array2d_container}
          >
            {createRender(render)}
          </div>
          <div
            style={{
              flex: 1,
              margin: '1% 0 2%',
            }}
            >
            {(algo === 'HashingLP' ||
              algo === 'HashingDH' ||
              algo === 'HashingCH') &&
              kth !== '' &&
              ((kth.fullCheck === undefined) && (kth.reinserting === undefined) ?
                (
                  <span
                    className={styles.captionHashing}
                  >
                    {(kth.type == 'I' || kth.type == 'BI') ? 'Inserting' : (kth.type == 'S' ? 'Searching' : (kth.type == 'D' ? 'Deleting' : '')) } Key{kth.type == 'BI' ? 's' : ''}: {kth.key}
                    {kth.insertions !== undefined && (
                      <span
                        className={styles.captionHashing}
                      >
                        &emsp;&emsp;&emsp;&emsp;
                        Insertions: {kth.insertions}
                      </span>
                    )}
                    {algo !== 'HashingCH' && (
                      <span
                      className={styles.captionHashing}
                      >
                        &emsp;&emsp;&emsp;&emsp;
                        Increment: {kth.increment}
                      </span>
                    )}
                  </span>
                ) : ((kth.fullCheck !== undefined) ? (
                  <span
                    className={styles.captionHashing}
                  >
                    {kth.fullCheck}
                  </span>
                ) : (
                  <span
                    className={styles.captionHashing}
                  >
                    Reinserting: {kth.reinserting}
                    &emsp;&emsp;&emsp;&emsp;
                    To reinsert: {kth.toReinsert}
                  </span>
                  )
                )
              )
            }
          </div>
        </div>
      );
    }

  }
}

export default Array2DRenderer;
/*
<<<<<<< HEAD
                    </td>
                  );
                })}
                {
                  (pointer && algo === 'tc' && (
                    <th className={classes(styles.col, styles.index)}>
                      <span className={styles.value}> i </span>
                    </th>
                  ))
                  ||
                  (algo === 'aStar' && i === 1 && (
                    <th className={classes(styles.col, styles.index)}>
                      <span className={styles.value}> )Priority </span>
                    </th>
                  ))
                  ||
                  (algo === 'aStar' && i === 2 && (
                    <th className={classes(styles.col, styles.index)}>
                      <span className={styles.value}> )Queue&ensp; </span>
                    </th>
                  ))
                  ||
                  (((algo === 'prim' && i === 2) ||
                    (algo === 'dijkstra' && i === 2)
                  ) && (
                      <th className={classes(styles.col, styles.index)}>
                        <span className={styles.value}> Priority Queue </span>
                      </th>
                    ))
                  || <td className={classes(styles.col, styles.index)} />}
              </tr>
            );
          })}
          {algo === 'tc' && (
            // Don't remove "j-tag='transitive_closure'"
            <tr j-tag="transitive_closure" className={styles.row}>
              <td />
              {data_T.map((row) => {
                let pointer = false;
                // eslint-disable-next-line no-plusplus
                for (let j = 0; j < row.length; j++) {
                  if (row[j].selected1) {
                    pointer = true;
                  }
                }
                return (
                  (pointer && (
                    <th className={classes(styles.col, styles.index)}>
                      <span className={styles.value}> j </span>
                    </th>
                  )) || <td className={classes(styles.col, styles.index)} />
                );
              })}
            </tr>
          )}
          {(algo === 'prim' ||
            algo === 'kruskal' ||
            algo === 'dijkstra' ||
            algo === 'aStar' ||
            algo === 'DFS' ||
            algo === 'DFSrec' ||
            algo === 'msort_lista_td' ||
            algo === 'BFS') &&
            data.map(
              (row, i) =>
                i === 2 && (
                  <AnimateSharedLayout>
                    <tr layout className={styles.row} key={i}>
                      {row.map((col, j) => (
                        <td
                          className={classes(styles.col, styles.variables)}
                          key={j}
=======
>>>>>>> 2024_sem2
*/
