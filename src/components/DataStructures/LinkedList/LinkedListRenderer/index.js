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
                    <line x1="0" y1="0" x2="100" y2="100" stroke="white" strokeWidth="20" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="white" strokeWidth="20" />
                </symbol>

                <symbol id="arrow-symbol" viewBox="0 0 100 100">
                    <line x1="30" y1="50" x2="70" y2="50" stroke="white" strokeWidth="2" />
                    <polyline points="60,40 70,50 60,60" stroke="white" strokeWidth="2" fill="none" />
                </symbol>
            </svg>
        );
    }

    renderData() {
        const {lists} = this.state;
        const layers = this.layer(lists);
        // console.log(layers);

        return (
            <div className={styles.LayerContainer}>
                {this.renderSymbols()}

                {layers.map((layer, layerIndex) => (
                    <div className={styles.linkedListContainer} key={`layer-${layerIndex}`}>

                        {layer.map((list, listIndex) => (
                            <div className={styles.nodeContainer} key={`list-${listIndex}`}>
                                <AnimateSharedLayout>

                                {list.data.map((node, nodeIndex) => (

                                    <React.Fragment key={`node-${listIndex}-${nodeIndex}`}>
                                        <>
                                            {/* Nodes */}
                                            <motion.div
                                                layoutId={`list-${listIndex}-node-${nodeIndex}`}
                                                className={classes(styles.node,
                                                    node.patched && styles.visited,
                                                    node.selected && styles.selected
                                                )}
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                transition={{type: 'spring', stiffness: 100}}
                                            >
                                                <div className={classes(styles.value)}>
                                                    {node.value}
                                                </div>

                                                {/* Labels */}
                                                {node.variables.map((variable, variableIndex) => (
                                                    <div className={styles.label} key={`variable-${variableIndex}`}>
                                                        <motion.div
                                                            className={styles.label}
                                                            layoutId={`variable-${listIndex}-${nodeIndex}-${variableIndex}`} // Unique layoutId
                                                        >
                                                            {variable}
                                                        </motion.div>
                                                    </div>))}
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


                                        </>
                                    </React.Fragment>

                                    ))}
                                </AnimateSharedLayout>
                            </div>))}
                    </div>))}
            </div>)
    }

    render() {
        return this.renderData();
    }

    layer(lists = []) {
        const layers = [];
        lists.forEach(item => {
            if (!layers[item.listIndex]) {
                layers[item.listIndex] = [];
            }
            layers[item.listIndex].push(item);
        });
        return layers;
    }
}

export default LinkedListRenderer;

