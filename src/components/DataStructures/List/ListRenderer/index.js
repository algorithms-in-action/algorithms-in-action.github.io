import React from 'react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import styles from './ListRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';

/**
 * 
 * This is how to pass multiple lists into the ListRenderer
 * 
  const data = {
  lists: [
    {
      objects: [...],
      labels: [...],
      dimensions: { baseWidth: 800, baseHeight: 600 }
    },
    {
      objects: [...],
      labels: [...],
      dimensions: { baseWidth: 800, baseHeight: 600 }
    },
    // Add more lists as needed
  ]
};

// Usage in a parent component
<ListRenderer data={data} />
 */

// This function determines the class to apply based on the current mode
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

        // Enabling panning and zooming for the SVG rendering
        this.togglePan(true);
        this.toggleZoom(true);
    }

    // This function is responsible for rendering a single list of objects and labels.
    // It accepts the list's data and its index in the array of lists (listIndex) for proper spacing
    renderList(listData, listIndex) {
        const { objects, dimensions, labels } = listData;  // Destructure list data (objects, dimensions, labels)
        const { baseWidth, baseHeight } = dimensions;  // Get the dimensions of the list
        const viewBox = [
            (this.centerX) / this.zoom,
            (this.centerY) / this.zoom,
            baseWidth / this.zoom,
            baseHeight / this.zoom,
        ];

        // Calculate the offset for the current list to avoid overlap with other lists
        const listOffsetX = listIndex * (baseWidth + 100); // Adds horizontal space between lists
        const listOffsetY = listIndex * (baseHeight + 50);  // Adds vertical space between lists

        return (
            <svg
                key={`list-${listIndex}`} // Unique key for each list
                className={switchmode(mode())} // Apply mode-based styles
                viewBox={viewBox}
                ref={this.elementRef} // Reference for panning/zooming functionality
            >
                <defs>
                    {/* Marker definitions for reuse in each object */}
                    <symbol id="null-marker" viewBox="0 0 100 100">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="20" />
                        <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="20" />
                    </symbol>

                    <symbol id={"arrow-symbol"} viewBox="0 0 100 100">
                        <line x1="30" y1="50" x2="70" y2="50" stroke="black" strokeWidth="2" />
                        <polyline points="60,40 70,50 60,60"
                            stroke="black" strokeWidth="2" fill="none" />
                    </symbol>

                    <rect
                        id={"rectMarker"} width={30} height={30}
                        x={'0'} y={'0'} />
                </defs>

                {/* Loop over objects in the list and render them */}
                {objects.map((obj) => {
                    const { value, key, isVisited, isSelected, label } = obj;  // Destructure object data

                    return (
                        <g
                            className={classes(styles.node)}
                            key={key} // Unique key for each object
                            // Translate based on key to position the object properly
                            transform={`translate(${key * 60 + listOffsetX}, 20)`}
                        >
                            {/* Render the rectangle (marker) */}
                            <use href={"#rectMarker"} x={'0'} y={'0'} width={'30'} height={'30'}
                                className={classes(styles.rect, isVisited && styles.visited,
                                    isSelected && styles.selected)} />

                            {/* Render the text (value inside the object) */}
                            <text x={'15'} y={'20'} width={'30'} height={'30'} textAnchor={'middle'}
                                className={styles.text}>
                                {value}
                            </text>

                            {/* Render visited marker at the bottom */}
                            <use href={"#rectMarker"} x={'0'} y={'390'} width={'30'} height={'30'}
                                className={classes(styles.rect, styles.visited)} />

                            {/* Render selected marker */}
                            <use href={"#rectMarker"} x={'0'} y={'340'} width={'30'} height={'30'}
                                className={classes(styles.rect, styles.selected)} />

                            {/* Render the arrow symbol */}
                            <use href={'#arrow-symbol'} x={'20'} y={'-10'} width={'50'} height={'50'} />

                            {/* Render the null marker */}
                            <use href={'#null-marker'} x={'5'} y={'290'} width={'20'} height={'20'}
                                textAnchor={"middle"} />
                        </g>
                    );
                })}

                {/* Loop over labels in the list and render them */}
                {labels.map(({ index, label }, order) => {
                    return (
                        <g
                            className={classes(styles.label)}
                            key={order}  // Unique key for each label
                            // Position the label using its index and list offset
                            transform={`translate(${index * 60 + listOffsetX}, ${order * 20 + 50 + listOffsetY})`}>
                            <text x={'15'} y={'20'} width={'30'} height={'30'}
                                textAnchor={'middle'}
                                className={styles.text}>
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    }

    // This function loops over all the lists and renders each one using renderList
    renderData() {
        const { lists } = this.props.data;  // Get the array of lists from the props
        return (
            <>
                {/* Loop through each list in the data and render it */}
                {lists.map((listData, listIndex) => this.renderList(listData, listIndex))}
            </>
        );
    }

    // Main render method calls renderData to render all the lists
    render() {
        return this.renderData();
    }
}

export default ListRenderer;



// import React from 'react';
// import {AnimateSharedLayout, motion} from 'framer-motion';
// import Renderer from '../../common/Renderer/index';
// import styles from './ListRenderer.module.scss';
// import { classes } from '../../common/util';
// import { mode } from '../../../top/Settings';

// let modename;
// function switchmode(modetype = mode()) {
//     switch (modetype) {
//         case 1:
//             modename = styles.EMPTY;
//             break;
//         case 2:
//             modename = styles.EMPTY;
//             break;
//         default:
//             modename = styles.list;
//     }
//     return modename;
// }


// class ListRenderer extends Renderer {
//     constructor(props) {
//         super(props);

//         this.togglePan(true);
//         this.toggleZoom(true);

//     }

//     renderData() {
//         const { objects, dimensions, labels} = this.props.data;
//         const { baseWidth, baseHeight } = dimensions;
//         const viewBox = [
//             (this.centerX) / this.zoom,
//             (this.centerY) / this.zoom,
//             baseWidth / this.zoom,
//             baseHeight / this.zoom,
//         ];

//         return (
//             <svg
//                 className={switchmode(mode())}
//                 viewBox={viewBox}
//                 ref={this.elementRef}
//             >
//                 <defs>
//                     <symbol id="null-marker" viewBox="0 0 100 100">
//                         <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="20"/>
//                         <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="20"/>
//                     </symbol>

//                     <symbol id={"arrow-symbol"} viewBox="0 0 100 100">
//                         <line x1="30" y1="50" x2="70" y2="50" stroke="black" strokeWidth="2"/>
//                         <polyline points="60,40 70,50 60,60"
//                                   stroke="black" strokeWidth="2" fill="none"/>
//                     </symbol>

//                     <rect
//                         id={"rectMarker"} width={30} height={30}
//                         x={'0'} y={'0'}/>
//                 </defs>

//                 {/*rendering items*/}
//                 {objects.map((obj) => {
//                     const { value, key, isVisited, isSelected, label} = obj;

//                     return (
//                         <g
//                             className={classes(styles.node)}
//                             key={key}
//                             transform={`translate(${key * 60}, 20)`}
//                         >
//                             <use href={"#rectMarker"} x={'0'} y={'0'} width={'30'} height={'30'}
//                                  className={classes(styles.rect, isVisited && styles.visited,
//                                      isSelected && styles.selected)}/>

//                             <text x={'15'} y={'20'} width={'30'} height={'30'} textAnchor={'middle'}
//                                   className={styles.text}>
//                                 {value}
//                             </text>

//                             <use href={"#rectMarker"} x={'0'} y={'390'} width={'30'} height={'30'}
//                                  className={classes(styles.rect, styles.visited)}/>

//                             <use href={"#rectMarker"} x={'0'} y={'340'} width={'30'} height={'30'}
//                                  className={classes(styles.rect, styles.selected)}/>


//                             <use href={'#arrow-symbol'} x={'20'} y={'-10'} width={'50'} height={'50'}/>

//                             <use href={'#null-marker'} x={'5'} y={'290'} width={'20'} height={'20'}
//                                  textAnchor={"middle"}/>
//                         </g>
//                     );
//                 })}

//                 {/*rendering labels*/}
//                 {labels.map(({index, label}, order) => {
//                     return (
//                         <g
//                             className={classes(styles.label)}
//                             key={order}
//                             transform={`translate(${index * 60}, ${order*20 + 50})`}>

//                             <text x={'15'} y={'20'} width={'30'} height={'30'}
//                                   textAnchor={'middle'}
//                                   className={styles.text}>
//                                 {label}
//                             </text>
//                         </g>
//                     )
//                 })}
//             </svg>


//         );
//     }

//     render() {
//         return this.renderData();
//     }
// }

// export default ListRenderer;