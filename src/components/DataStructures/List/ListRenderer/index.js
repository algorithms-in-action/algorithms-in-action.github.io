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
        // eslint-disable-next-line
        const { data, algo, stack, stackDepth, listOfNumbers } = this.props.data;

        let scaleY = () => 0

        const arrayMagnitudeScaleValue = 20; // value to scale an array e.g. so that the maximum item is 150px tall

        return (
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
                                    <motion.span
                                        layout="position"
                                        className={classes(
                                            styles.value,
                                            col.style && col.style.textStyle,
                                        )}
                                    >
                                        {this.toString(col.value)}
                                    </motion.span>
                                </motion.div>
                            ))}
                        </div>
                    ))}

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
                                            minHeight: '50px',
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
                    </motion.div>
                </tbody>
            </table>
        );
    }
}

export default ListRenderer;
