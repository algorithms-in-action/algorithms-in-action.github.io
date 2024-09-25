import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import styles from './LinkedListRenderer.module.scss';
import { classes } from '../../common/util';

class LinkedListRenderer extends Renderer {
    constructor(props) {
        super(props);

        this.state = {
            lists: props.data.lists, // assuming the linked lists are passed as props
        };
    }

    renderData() {
        const { lists } = this.state;

        return (
            <div className={styles.multiLinkedListContainer}>
                <AnimateSharedLayout>
                    {lists.map((list, listIndex) => (
                        <div className={styles.linkedListContainer} key={`list-${listIndex}`}>
                            <div className={styles.listIdentifier}>
                                Linked List {listIndex + 1}
                            </div>
                            {list.nodes.map((node, nodeIndex) => (
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
                                                    →
                                                </motion.div>
                                            ) : (
                                                <motion.div className={styles.null}>null</motion.div>
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
}

export default LinkedListRenderer;





// old code supporting only 1 list

// import React from 'react';
// import { motion, AnimateSharedLayout } from 'framer-motion';
// import Renderer from '../../common/Renderer/index';
// import styles from './LinkedListRenderer.module.scss';
// import { classes } from '../../common/util';

// class LinkedListRenderer extends Renderer{
//     constructor(props) {
//         super(props);

//         this.state = {
//             nodes: props.data.nodes, // assuming the linked list data is passed as props
//         };
//     }

//     renderData() {
//         const { nodes } = this.state;

//         return (
//             <div className={styles.linkedListContainer}>
//                 <AnimateSharedLayout>
//                     {nodes.map((node, index) => (
//                         <div className={styles.nodeContainer} key={index}>
//                             <motion.div
//                                 layoutId={`node-${index}`}
//                                 className={styles.node}
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ type: 'spring', stiffness: 100 }}
//                             >
//                                 <div className={styles.value}>{node.value}</div>
//                                 <div className={styles.pointer}>
//                                     {node.next !== null ? (
//                                         <motion.div
//                                             className={styles.arrow}
//                                             layoutId={`arrow-${index}`}
//                                         >
//                                             →
//                                         </motion.div>
//                                     ) : (
//                                         <motion.div className={styles.null}>null</motion.div>
//                                     )}
//                                 </div>
//                             </motion.div>
//                         </div>
//                     ))}
//                 </AnimateSharedLayout>
//             </div>
//         );
//     }
// }

// export default LinkedListRenderer;
