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

        this.maxStackDepth = 0;
    }

    renderData() {
        const { data, algo, stack, stackDepth } = this.props.data;
        const listMagnitudeScaleValue = 20;

        let largestValue = data.reduce(
            (acc, curr) => (acc < curr.value ? curr.value : acc),
            0,
        );

        let scaleY = ((largest, value) =>
            (typeof value !== "number" ? 0 :
                (value / largest) * listMagnitudeScaleValue)).bind(
            null,
            largestValue,
        );
        if (!this.props.data.listItemMagnitudes) {
            scaleY = () => 0;
        }

        return (
            <div
                className={switchmode(mode())}
                style={{
                    marginLeft: -this.centerX * 2,
                    marginTop: -this.centerY * 2,
                    transform: `scale(${this.zoom})`,
                }}
            >
                <motion.div animate={{ scale: this.zoom }} className={switchmode(mode())}>
                    {/* Values */}
                    {data.map((item, i) => (
                        <motion.div
                            layout
                            transition={{ duration: 0.6 }}
                            style={{
                                height: `${this.toString(scaleY(item.value))}vh`,
                                display: 'flex',
                            }}
                            className={classes(
                                styles.item,
                                item.faded && styles.faded,
                                item.selected && styles.selected,
                                item.patched && styles.patched,
                                item.sorted && styles.sorted,
                                item.style && item.style.backgroundStyle,
                            )}
                            key={item.key}
                        >
                            <motion.span
                                layout="position"
                                className={classes(
                                    styles.value,
                                    item.style && item.style.textStyle,
                                )}
                            >
                                {this.toString(item.value)}
                            </motion.span>
                        </motion.div>
                    ))}

                    <div>
                        {/* Stack */}
                        {stack && stack.length > 0 ? (
                            this.maxStackDepth = Math.max(this.maxStackDepth, stackDepth),
                                stackRenderer(stack, data.length, stackDepth, this.maxStackDepth)
                        ) : (
                            <div />
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }
}

/**
 * Renders a stack specific to the list structure.
 * @param {} stack
 * @param {*} nodeCount
 * @param {*} stackDepth
 * @returns
 */
function stackRenderer(stack, nodeCount, stackDepth, maxStackDepth) {
    if (!stack) {
        return <div />;
    }
    let stackItems = [];
    for (let i = 0; i < stack.length; i += 1) {
        stackItems.push(
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {stack[i].map(({ base, extra }, index) =>
                    (
                        <div
                            className={styles.stackElement}
                            style={{
                                width: `calc(100%/${nodeCount})`,
                                textAlign: 'center',
                                color: 'gray',
                                backgroundColor: stackFrameColour(base),
                            }}
                        >
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
                    )
                )}
            </div>,
        );
    }

    return (
        <div className={styles.stack}>
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
 * @param {*} color_index - an integer representing the state of a stack element
 * @returns string
 */
function stackFrameColour(color_index) {
    return [
        'var(--not-started-section)', // 0
        'var(--in-progress-section)', // 1
        'var(--current-section)',     // 2
        'var(--finished-section)',    // 3
        'var(--i-section)',           // 4
        'var(--j-section)',           // 5
        'var(--p-section)',           // 6
    ][color_index];
}

export default ListRenderer;
