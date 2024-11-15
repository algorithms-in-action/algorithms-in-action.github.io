import React from 'react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import styles from './ListRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';

/**
 * Example data for multiple lists:
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

// Usage in a parent component:
<ListRenderer data={data} />
 */

// Helper function to switch styles based on mode
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

        // Enabling panning and zooming for the SVG
        this.togglePan(true);
        this.toggleZoom(true);
    }

    // This function renders a single list
    renderList(listData, listIndex) {
        const { objects, dimensions, labels } = listData;
        const { baseWidth, baseHeight } = dimensions;

        // Calculate viewBox and list offsets
        const viewBox = [
            (this.centerX) / this.zoom,
            (this.centerY) / this.zoom,
            baseWidth / this.zoom,
            baseHeight / this.zoom,
        ];

        // List offsets for positioning
        const listOffsetX = listIndex * (baseWidth + 100);  // Horizontal space between lists
        const listOffsetY = listIndex * (baseHeight + 50);  // Vertical space between lists

        return (
            <g
                key={`list-${listIndex}`} // Unique key for each list
                transform={`translate(${listOffsetX}, ${listOffsetY})`}  // Apply list offsets
                className={switchmode(mode())} // Apply mode-based styles
            >
                {objects.map((obj) => {
                    const { value, key, isVisited, isSelected } = obj;

                    return (
                        <g
                            className={classes(styles.node)}
                            key={key}
                            transform={`translate(${key * 60}, 20)`} // Horizontal positioning of nodes
                        >
                            {/* Render object rectangle */}
                            <use href={"#rectMarker"} width={'30'} height={'30'}
                                className={classes(styles.rect, isVisited && styles.visited, isSelected && styles.selected)}
                            />

                            {/* Render object text */}
                            <text x={'15'} y={'20'} width={'30'} height={'30'} textAnchor={'middle'}
                                className={styles.text}>
                                {value}
                            </text>

                            {/* Render arrow */}
                            <use href={"#arrow-symbol"} x={'20'} y={'-10'} width={'50'} height={'50'} />

                            {/* Render null marker */}
                            <use href={"#null-marker"} x={'5'} y={'290'} width={'20'} height={'20'} />
                        </g>
                    );
                })}

                {/* Render labels */}
                {labels.map(({ index, label }, order) => (
                    <g
                        className={classes(styles.label)}
                        key={order}
                        transform={`translate(${index * 60}, ${order * 20 + 50})`}>
                        <text x={'15'} y={'20'} width={'30'} height={'30'} textAnchor={'middle'}
                            className={styles.text}>
                            {label}
                        </text>
                    </g>
                ))}
            </g>
        );
    }

    // Main rendering function that loops through all lists
    renderData() {
        const { lists, dimensions } = this.props.data;
        const { baseWidth, baseHeight } = dimensions;

        const viewBox = [
            (this.centerX) / this.zoom,
            (this.centerY) / this.zoom,
            baseWidth / this.zoom,
            baseHeight / this.zoom,
        ];

        return (
            <svg viewBox={viewBox} ref={this.elementRef} className={switchmode(mode())}>
                <defs>
                    <symbol id="null-marker" viewBox="0 0 100 100">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="20" />
                        <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="20" />
                    </symbol>

                    <symbol id={"arrow-symbol"} viewBox="0 0 100 100">
                        <line x1="30" y1="50" x2="70" y2="50" stroke="black" strokeWidth="2" />
                        <polyline points="60,40 70,50 60,60" stroke="black" strokeWidth="2" fill="none" />
                    </symbol>

                    <rect id={"rectMarker"} width={30} height={30} x={'0'} y={'0'} />
                </defs>

                {/* Render each list */}
                {lists.map((listData, listIndex) => this.renderList(listData, listIndex))}
            </svg>
        );
    }

    // Main render method
    render() {
        return this.renderData();
    }
}

export default ListRenderer;