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
import {AnimateSharedLayout, motion} from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import styles from './ListRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';
import {calculateControlCord} from "../../Graph/GraphRenderer";

let modename;
function switchmode(modetype = mode()) {
    switch (modetype) {
        case 1:
            modename = styles.list_green;
            break;
        case 2:
            modename = styles.list_blue;
            break;
        default:
            modename = styles.list;
    }
    return modename;
}


class ListRenderer extends Renderer {
    constructor(props) {
        super(props);

        this.togglePan(true);
        this.toggleZoom(true);

    }

    renderData() {

        const { objects, dimensions,} =
            this.props.data;
        const {
            baseWidth,
            baseHeight,
        } = dimensions;

        const viewBox = [
            (this.centerX) / this.zoom,
            (this.centerY) / this.zoom,
            baseWidth / this.zoom,
            baseHeight / this.zoom,
        ];

        return (
          <svg
              className={switchmode(mode())}
              viewBox={viewBox}
              ref={this.elementRef}
          >
              <defs>
                  <marker
                      id="circleMarker"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                  >
                      <circle cx="5" cy="5" r="5" className={classes(styles.circle)}/>
                  </marker>
                  <marker
                      id="circleMarkerSelected"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                  >
                      <circle
                          cx="5"
                          cy="5"
                          r="5"
                          className={classes(styles.circle, styles.selected)}
                      />
                  </marker>
                  <marker
                      id="circleMarkerVisited"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                  >
                      <circle
                          cx="5"
                          cy="5"
                          r="5"
                          className={classes(styles.circle, styles.visited)}
                      />
                  </marker>
              </defs>

              {/*rendering items*/}
              {objects.map(({value, id}) => {

                  /* Code for figuring out isvisited / isselected
                  console.log(item);
                  const { label, isSelected, isVisited } = item;
                  const markerId = isSelected
                      ? 'circleMarkerSelected'
                      : isVisited
                          ? 'circleMarkerVisited'
                          : 'circleMarker';

                                                    <use href={`#${index}`} />

                   */
                  return (
                      <g
                          className={classes(styles.node)}
                          key={id}
                          transform={`translate(${id * 40}, 20)`}
                          >
                          <rect className = {styles.rect}
                                  x={'30'} y={'5'}
                                width={'20'} height={'20'}/>
                          <text x="30" y="5" className={styles.label}>
                              {value}
                          </text>
                      </g>

                      // example code which adds in conditions for is selected and visited.
                      // will need to figure out first how to embed data into the elements such as the boolean for
                      // isvisited.
                      /*
                      <g
                          className={classes(
                              styles.listItem,
                              isSelected && styles.selected,
                              isVisited && styles.visited
                          )}
                          key={index}
                          transform={`translate(20, ${40 + index * 40})`}
                      >
                          <use href={`#${markerId}`} />
                          <text x="30" y="5" className={styles.label}>
                              {label}
                          </text>
                       */
                  );
              })}
          </svg>
        );
    }


}

export default ListRenderer;