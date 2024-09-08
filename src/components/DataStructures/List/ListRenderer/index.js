import React from 'react';
import {AnimateSharedLayout, motion} from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import styles from './ListRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';

let modename;
function switchmode(modetype = mode()) {
    switch (modetype) {
        case 1:
            modename = styles.EMPTY;
            break;
        case 2:
            modename = styles.EMPTY;
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
        const { objects, dimensions, labels} = this.props.data;
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
                {objects.map((obj) => {
                    const { value, key, isVisited, isSelected, label} = obj;

                    return (
                        <g
                            className={classes(styles.node)}
                            key={key}
                            transform={`translate(${key * 60}, 20)`}
                        >
                            <use href={"#rectMarker"} x={'0'} y={'0'} width={'30'} height={'30'}
                                 className={classes(styles.rect, isVisited && styles.visited,
                                     isSelected && styles.selected)}/>

                            <text x={'15'} y={'20'} width={'30'} height={'30'} textAnchor={'middle'}
                                  className={styles.text}>
                                {value}
                            </text>

                            <use href={"#rectMarker"} x={'0'} y={'390'} width={'30'} height={'30'}
                                 className={classes(styles.rect, styles.visited)}/>

                            <use href={"#rectMarker"} x={'0'} y={'340'} width={'30'} height={'30'}
                                 className={classes(styles.rect, styles.selected)}/>


                            <use href={'#arrow-symbol'} x={'20'} y={'-10'} width={'50'} height={'50'}/>

                            <use href={'#null-marker'} x={'5'} y={'290'} width={'20'} height={'20'}
                                 textAnchor={"middle"}/>
                        </g>
                    );
                })}

                {/*rendering labels*/}
                {labels.map(({index, label}, order) => {
                    return (
                        <g
                            className={classes(styles.label)}
                            key={order}
                            transform={`translate(${index * 60}, ${order*20 + 50})`}>

                            <text x={'15'} y={'20'} width={'30'} height={'30'}
                                  textAnchor={'middle'}
                                  className={styles.text}>
                                {label}
                            </text>
                        </g>
                    )
                })}
            </svg>


        );
    }

    render() {
        return this.renderData();
    }
}

export default ListRenderer;