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
import Renderer from '../../common/Renderer/index';
import styles from './TwoArray2DRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';

let modename;
function switchmode(modetype = mode()) {
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


class TwoArray2DRenderer extends Renderer {
  constructor(props) {
    super(props);

    this.togglePan(true);
    this.toggleZoom(true);
  }

  renderData() {
    const { data, data1,algo } = this.props.data;

    const isArray1D = true;
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
            longestRow.map((_, i) => {
              // if the graph instance is heapsort, then the array index starts from 1
              if (algo === 'horspools') {
                i = '';
              }
              return (
                <td className={classes(styles.col, styles.index)} key={i}>
                  <span className={styles.value}>{i}</span>
                </td>
              );
            })
          }
        </tr>
        {
          data.map((row, i) => (
            <tr className={styles.row} key={i}>
              {
                !isArray1D &&
                <td className={classes(styles.col, styles.index)}>
                  <span className={styles.value}>{i}</span>
                </td>
              }
              {
                row.map((col, j) => (
                  <td className={classes(styles.col, col.selected && styles.selected, col.patched && styles.patched, col.sorted && styles.sorted)}
                      key={j}>
                    <span className={styles.value}>{this.toString(col.value)}</span>
                  </td>
                ))
              }
            </tr>
            )
          )
        }
        <td style={{ paddingBottom: '15px' }} />
        {
          data1.map((row, i) => (
            <tr className={styles.row} key={i}>
              {
                !isArray1D &&
                <td className={classes(styles.col, styles.index)}>
                  <span className={styles.value}>{i}</span>
                </td>
              }
              {
                row.map((col, j) => (
                  <td className={classes(styles.col, col.selected && styles.selected, col.patched && styles.patched, col.sorted && styles.sorted)}
                      key={j}>
                    <span className={styles.value}>{this.toString(col.value)}</span>
                  </td>
                ))
              }
            </tr>
          ))
        }
        </tbody>
      </table>
    );
  }
}

export default TwoArray2DRenderer;

