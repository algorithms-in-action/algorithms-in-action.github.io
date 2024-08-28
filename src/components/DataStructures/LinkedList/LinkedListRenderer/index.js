import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import styles from './LinkedListRenderer.module.scss';
import { classes } from '../../common/util';

class LinkedListRenderer extends Renderer{
    constructor(props) {
        super(props);

        this.state = {
            nodes: props.data.nodes, // assuming the linked list data is passed as props
        };
    }

    renderData() {
        const { nodes } = this.state;

        return (
            <div className={styles.linkedListContainer}>
                <AnimateSharedLayout>
                    {nodes.map((node, index) => (
                        <div className={styles.nodeContainer} key={index}>
                            <motion.div
                                layoutId={`node-${index}`}
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
                                            layoutId={`arrow-${index}`}
                                        >
                                            →
                                        </motion.div>
                                    ) : (
                                        <motion.div className={styles.null}>null</motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </AnimateSharedLayout>
            </div>
        );
    }
}

export default LinkedListRenderer;
