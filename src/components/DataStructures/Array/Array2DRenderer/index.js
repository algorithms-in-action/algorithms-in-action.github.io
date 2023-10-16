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
import Renderer from '../../common/Renderer/index';
import styles from './Array2DRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';

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

class Array2DRenderer extends Renderer {
  constructor(props) {
    super(props);

    this.togglePan(true);
    this.toggleZoom(true);
  }

  renderData() {
    const { data, algo, kth, listOfNumbers } = this.props.data;
    const isArray1D = true;
    // eslint-disable-next-line camelcase
    let data_T;
    if (algo === 'tc') {
      // eslint-disable-next-line camelcase
      data_T = data[0].map((col, i) => data.map((row) => row[i]));
    }
    // const isArray1D = this instanceof Array1DRenderer;
    let longestRow = data.reduce((longestRow, row) => longestRow.length < row.length ? row : longestRow, []);
    return (
      
      <table className={switchmode(mode())}
             style={{ marginLeft: -this.centerX * 2, marginTop: -this.centerY * 2, transform: `scale(${this.zoom})` }}>
        <tbody>
        <tr className={styles.row}>
          {
            !isArray1D &&
            <td className={classes(styles.col, styles.index)} />
          }
          {
            algo === 'tc' && // Leave a blank cell at the header row
            <td />
          }
          { 
            (algo !== 'BFS' && algo !== 'DFS' && algo !== 'dijkstra' && algo !== 'aStar') &&
            longestRow.map((_, i) => {
              if (algo === 'tc') {
                i += 1;
              }
              if (algo === 'prim') {
                i = ' ';
              }
              return (
                <th className={classes(styles.col, styles.index)} key={i}>
                  <span className={styles.value}>{ i }</span>
                </th>
              );
            })
          }
        </tr>
        {
          data.map((row, i) => {
            let pointer = false;
            // eslint-disable-next-line no-plusplus
            for (let j = 0; j < row.length; j++) {
              if (row[j].selected) {
                pointer = true;
              }
            }
            return (
            <tr className={styles.row} key={i}>
              {
                algo === 'tc' && // generate vertical index, which starts from 1
                <th className={classes(styles.col, styles.index)} key={i}>
                  <span className={styles.value}>{ i + 1 }</span>
                </th>
              }
              {
                !isArray1D && algo !== 'tc' &&
                <td className={classes(styles.col, styles.index)}>
                  <span className={styles.value}>{i}</span>
                </td>
              }
              {
                row.map((col, j) => (
                  <td className={classes(styles.col, col.selected && styles.selected, col.patched && styles.patched,
                    col.sorted && styles.sorted, col.selected1 && styles.selected1, col.selected2 && styles.selected2, 
                    col.selected3 && styles.selected3, col.selected4 && styles.selected4, col.selected5 && styles.selected5)}
                      key={j}>
                    <span className={styles.value}>{this.toString(col.value)}</span>
                  </td>
                ))
              }
              {
                pointer && algo === 'tc'
                ? (
                  <th className={classes(styles.col, styles.index)}>
                      <span className={styles.value}> i </span>
                  </th>
                )
                : algo === 'prim' && i === 2
                ? (
                  <th className={classes(styles.col, styles.index)}>
                      <span className={styles.value}> Priority Queue </span>
                  </th>
                )
                : algo === 'dijkstra' && i === 2
                ? (
                  <th className={classes(styles.col, styles.index)}>
                      <span className={styles.value}> Priority Queue </span>
                  </th>
                )
                : algo === 'aStar' && i === 3
                ? (
                  <th className={classes(styles.col, styles.index)}>
                      <span className={styles.value}> Priority Queue </span>
                  </th>
                )
                : (
                  <td className={classes(styles.col, styles.index)} />
                )
              }
            </tr>
            );
          })
        }
        {
        algo === 'tc' &&
        // Don't remove "j-tag='transitive_closure'"
        <tr j-tag='transitive_closure' className={styles.row}>
          <td />
          {
            data_T.map((row) => {
              let pointer = false;
              // eslint-disable-next-line no-plusplus
              for (let j = 0; j < row.length; j++) {
                if (row[j].selected1) {
                  pointer = true;
                }
              }
              return (
                (pointer &&
                <th className={classes(styles.col, styles.index)}>
                  <span className={styles.value}> j </span>
                </th>) || <td className={classes(styles.col, styles.index)} />
              );
            })
          }
        </tr>
        }
        {
          (algo === 'prim'|| algo === 'dijkstra'|| algo === 'aStar' || algo === 'DFS' || algo == 'BFS') &&
          data.map((row, i) => (
            i === 2 && (
                <AnimateSharedLayout>
                <tr layout className={styles.row} key={i}>
                {row.map((col, j) => (
                    <td
                    className={classes(styles.col, styles.variables)}
                    key={j}>
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
          ))
        }
        </tbody>
        {
          algo === 'tc' &&
          <caption kth-tag='transitive_closure'>
            k = { kth }
          </caption>
        } 
        {
          algo === 'DFS' &&
          <caption className={algo === 'DFS' ? styles.captionDFS : ''} kth-tag='dfs_caption'>
              Nodes(stack): {listOfNumbers}
          </caption>
        }
        {
          algo === 'BFS' &&
          <caption className={algo === 'BFS' ? styles.captionBFS : ''} kth-tag='bfs_caption'>
              Nodes(queue): {listOfNumbers}
          </caption>
        }
      </table> 
     
    );
  }
} 


export default Array2DRenderer;
