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
import React, {useEffect, useRef} from 'react';
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
        const { objects, dimensions } = this.props.data;
        const { baseWidth, baseHeight } = dimensions;
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
                    <symbol id="null-marker" viewBox="0 0 100 100">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="20"/>
                        <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="20"/>
                    </symbol>

                    <symbol id={"arrow-symbol"} viewBox="0 0 100 100">
                        <line x1="30" y1="50" x2="70" y2="50" stroke="black" strokeWidth="2"/>
                        <polyline points="60,40 70,50 60,60"
                                  stroke="black" strokeWidth="2" fill="none"/>
                    </symbol>

                    <rect
                        id={"rectMarker"} width={30} height={30}
                        x={'0'} y={'0'}/>
                </defs>

                {/*rendering items*/}
                {objects.map(({value, key}) => {

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
                            key={key}
                            transform={`translate(${key * 60}, 20)`}
                        >
                            <use href={"#rectMarker"} x={'0'} y={'0'} width={'30'} height={'30'}
                                 className={classes(styles.rect)}/>

                            <use href={"#rectMarker"} x={'0'} y={'90'} width={'30'} height={'30'}
                                 className={classes(styles.rect, styles.visited)}/>

                            <use href={"#rectMarker"} x={'0'} y={'140'} width={'30'} height={'30'}
                                 className={classes(styles.rect, styles.selected)}/>


                            <use href={'#arrow-symbol'} x={'20'} y={'-10'} width={'50'} height={'50'}/>
                            <use href={'#null-marker'} x={'5'} y={'50'} width={'20'} height={'20'}
                                 textAnchor={"middle"}/>

                            <text x={'15'} y={'20'} width={'30'} height={'30'} textAnchor={'middle'}
                                  className={styles.label}>
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

    render() {
        return this.renderData();
    }
}

export default ListRenderer;