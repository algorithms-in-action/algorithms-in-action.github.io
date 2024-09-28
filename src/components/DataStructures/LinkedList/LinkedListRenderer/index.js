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
        console.log(lists)
        return (
            <div className={styles.multiLinkedListContainer}>
                {this.renderSymbols()}

                <AnimateSharedLayout>
                    {lists.map((list, listIndex) => (
                        <div className={styles.linkedListContainer} key={`list-${listIndex}`}>

                            {list.data.map((node, nodeIndex) => (
                                <div className={styles.nodeContainer} key={`node-${listIndex}-${nodeIndex}`}>
                                    <motion.div
                                        layoutId={`list-${listIndex}-node-${nodeIndex}`}
                                        className={styles.node}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 100 }}
                                    >
                                        <div className={styles.value}>{node.value}</div>

                                        <div className={styles.pointer}>
                                            {node.next !== null ? (
                                                <motion.div
                                                    className={styles.arrow}
                                                    layoutId={`list-${listIndex}-arrow-${nodeIndex}`}
                                                >
                                                    <svg className={styles.icon} width="20" height="20">
                                                        <use href="#arrow-symbol"/>
                                                    </svg>
                                                </motion.div>
                                            ) : (
                                                <motion.div className={styles.null}>

                                                    <svg className={styles.icon} width="20" height="20">
                                                        <use href="#arrow-symbol"/>
                                                    </svg>
                                                    <svg className={styles.icon} width="20" height="20">
                                                        <use href="#null-marker"/>
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    ))}
                </AnimateSharedLayout>
            </div>
        );
    }

    render() {
        return this.renderData();
    }
}

export default LinkedListRenderer;