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
            <svg style={{display: 'none'}}>
                <symbol id="null-marker" viewBox="0 0 100 100">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="white" strokeWidth="20"/>
                    <line x1="100" y1="0" x2="0" y2="100" stroke="white" strokeWidth="20"/>
                </symbol>

                <symbol id="arrow-symbol" viewBox="0 0 100 100">
                    <line x1="30" y1="50" x2="70" y2="50" stroke="white" strokeWidth="2"/>
                    <polyline points="60,40 70,50 60,60" stroke="white" strokeWidth="2" fill="none"/>
                </symbol>
            </svg>
        );
    }

    renderData() {
        const {lists} = this.state;
        const layers = this.layer(lists);
        console.log(layers);

        return (
            <AnimateSharedLayout>
                <motion.div className={styles.LayerContainer}
                            drag
                >
                {this.renderSymbols()}

                {layers.map((layer, layerIndex) => (
                    <div className={styles.linkedListContainer} key={`layer-${layerIndex}`}>

                        {layer.map((list, listIndex) => (
                            <div className={styles.nodeContainer} key={`list-${listIndex}`}
                                style={{transform: `translate(${list.unitShift*76}px)`}}>

                                {list.data.map((node, nodeIndex) => (

                                    <React.Fragment>
                                            <motion.div
                                                key={`node-${node.key}`}
                                                layoutId={`node-${node.key}`}
                                                className={classes(styles.node,
                                                    node.patched && styles.visited,
                                                    node.selected && styles.selected
                                                )}
                                                whileHover={{scale: 1.2}}
                                                transition={{type: 'spring', stiffness: 100}}
                                            >
                                                {/* Nodes */}
                                                <div className={classes(styles.value)}>
                                                    {console.log(node.key)}
                                                    {node.value}
                                                </div>

                                                {/* Labels */}
                                                {node.variables.map((variable, variableIndex) => (
                                                    <div className={styles.label} key={`variable-${variableIndex}`}
                                                            layoutId={`variable-${listIndex}-${nodeIndex}-${variableIndex}`}
                                                        >
                                                            {variable}
                                                    </div>))}
                                            </motion.div>

                                        {/* Arrows */}
                                        <div className={styles.symbol}>
                                            <div
                                                className={styles.arrow}
                                                layoutId={`list-${listIndex}-arrow-${nodeIndex}`}
                                            >
                                                <svg className={classes(styles.arrow)}>
                                                    <use href="#arrow-symbol"/>
                                                </svg>

                                                {
                                                    // upwards and downwards diagonal arrows
                                                    /*<svg className={classes(styles.symbol,styles.diagonal)} width="40" height="40">
                                                    <use href="#downwards-diagonal"/>
                                                </svg> */
                                                }
                                                {
                                                    // testing for last node
                                                    // {list.size-nodeIndex>1 && <use href="#arrow-symbol"/>}
                                                }
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>))}
                    </div>))}
            </motion.div>
        </AnimateSharedLayout>)
    }

    render() {
        return this.renderData();
    }

    // group by listIndex for rendering
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

