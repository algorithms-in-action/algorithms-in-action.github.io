import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import styles from './LinkedListRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';

class LinkedListRenderer extends Renderer {
    constructor(props) {
        super(props);

        this.state = {
            lists: props.data.lists, // assuming the linked lists are passed as props
        };
    }

    // Define the symbols
    renderSymbols() {
        return (
            <svg style={{ display: 'none' }}>
                <symbol id="null-marker" viewBox="0 0 100 100">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="20" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="20" />
                </symbol>

                <symbol id="arrow-symbol" viewBox="0 0 100 100">
                    <line x1="30" y1="50" x2="70" y2="50" stroke="black" strokeWidth="2" />
                    <polyline points="60,40 70,50 60,60" stroke="black" strokeWidth="2" fill="none" />
                </symbol>
            </svg>
        );
    }

    renderData() {
        const { lists } = this.state;
        return (
            <div className={styles.multiLinkedListContainer}>
                {this.renderSymbols()}

                    {lists.map((list, listIndex) => (
                        <div className={styles.linkedListContainer} key={`list-${listIndex}`}>
                            {list.data.map((node, nodeIndex) => (
                                <div className={styles.nodeContainer} key={`node-${listIndex}-${nodeIndex}`}>
                                    <AnimateSharedLayout>
                                    {/* Nodes */}
                                    <motion.div
                                        layoutId={`list-${listIndex}-node-${nodeIndex}`}
                                        className={styles.nodeContainer}
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{type: 'spring', stiffness: 100}}
                                    >
                                        <div className={
                                            classes(styles.value,
                                                node.patched && styles.visited,
                                                node.selected && styles.selected)}>
                                            {node.value}
                                        </div>
                                    </motion.div>

                                    {/* Arrows */}
                                    <div className={styles.symbol}>
                                        <motion.div
                                            className={styles.symbol}
                                            layoutId={`list-${listIndex}-arrow-${nodeIndex}`}
                                        >
                                            <svg className={styles.symbol} width="40" height="40">
                                                <use href="#arrow-symbol"/>
                                            </svg>
                                        </motion.div>
                                    </div>

                                    {/* Null Marker */}
                                    {node.next == null && (
                                        <motion.div className={styles.symbol}>
                                            <svg className={styles.symbol} width="20" height="20">
                                                <use href="#null-marker"/>
                                            </svg>
                                        </motion.div>
                                    )}
                                </AnimateSharedLayout>
                                    {/* Labels */}
                                    {node.variables.map(variable => (
                                        <div className={styles.label}>
                                            <motion.div
                                                className={styles.label}
                                                layoutId={node.variables}
                                            >
                                                {variable}
                                            </motion.div>
                                        </div>))}
                                </div>
                            )
                        )}
                        </div>
                        )
                    )}
            </div>
        )
            ;
    }

    render() {
        return this.renderData();
    }

}

export default LinkedListRenderer;