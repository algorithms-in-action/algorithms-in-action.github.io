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
import { motion } from 'framer-motion';
import Renderer from '../../common/Renderer/index';
import { classes, distance } from '../../common/util';
import styles from './NAryTreeRenderer.module.scss';
import { mode } from '../../../top/Settings';
import { calculateControlCord } from '../GraphRenderer/index.js';

// cannot import since uses different styles
let modename;
function switchmode(modetype = mode()) {
    switch (modetype) {
        case 1:
            modename = styles.graphgreen;
            break;
        case 2:
            modename = styles.graphblue;
            break;
        default:
            modename = styles.graph;
    }
    return modename;
}

class NAryTreeRenderer extends Renderer {
    constructor(props) {
        super(props);

        this.elementRef = React.createRef();
        this.selectedNode = null;

        this.togglePan(true);
        this.toggleZoom(true);
    }

    handleMouseDown(e) {
        super.handleMouseDown(e);
        const coords = this.computeCoords(e);
        const { nodes, dimensions } = this.props.data;
        const { nodeRadius } = dimensions;
        this.selectedNode = nodes.find(
            (node) => distance(coords, node) <= nodeRadius
        );
    }

    handleMouseMove(e) {
        if (this.selectedNode) {
            const { x, y } = this.computeCoords(e);
            const node = this.props.data.findNode(this.selectedNode.id);
            node.x = x;
            node.y = y;
            this.refresh();
        } else {
            super.handleMouseMove(e);
        }
    }

    computeCoords(e) {
        const svg = this.elementRef.current;
        const s = svg.createSVGPoint();
        s.x = e.clientX;
        s.y = e.clientY;
        const { x, y } = s.matrixTransform(svg.getScreenCTM().inverse());
        return { x, y };
    }

    renderData() {
        const {
            nodes,
            edges,
            isDirected,
            showSelfLoop,
            variableNodes,
            isReversed,
            dimensions,
            text,
            baseOffset,
            functionName
        } = this.props.data;
        const {
            baseWidth,
            baseHeight,
            nodeRadius,
            arrowGap,
        } = dimensions;
        const viewBox = [
            (this.centerX - baseWidth / 2) / this.zoom,
            (this.centerY - baseHeight / 2) / this.zoom,
            baseWidth / this.zoom,
            baseHeight / this.zoom,
        ];
        const root = nodes[0];
        let rootX = 0;
        let rootY = 0;
        if (root) {
            rootX = root.x;
            rootY = root.y;
        }

        // adjusting arrow size for when reversing and have multiple children pointing to one parent
        const sizeAdjust = isReversed ? 0.5 : 1;

        return (
            <svg
                className={switchmode(mode())}
                viewBox={viewBox}
                ref={this.elementRef}
            >
                <defs>
                    <marker
                        id="markerArrow"
                        markerWidth={`${6 * sizeAdjust}`}
                        markerHeight={`${6 * sizeAdjust}`}
                        refX={`${3 * sizeAdjust}`}
                        refY={`${3 * sizeAdjust}`}
                        orient="auto"
                    >
                        <path
                            d={`M0,0 L0,${6 * sizeAdjust} L${6 * sizeAdjust},${3 * sizeAdjust
                                } L0,0`}
                            className={styles.arrow}
                        />
                    </marker>
                </defs>
                {edges
                    .map((edge) => {
                        const {
                            source,
                            target,
                        } = edge;

                        let sourceNode, targetNode;
                        if (variableNodes) {
                            sourceNode = this.props.data.findVariableNode(source);
                            targetNode = this.props.data.findVariableNode(target);
                            if (sourceNode.id === 0) return undefined;
                        } else {
                            sourceNode = this.props.data.findNode(source);
                            targetNode = this.props.data.findNode(target);
                        }

                        if (!sourceNode || !targetNode) return undefined;
                        let pathSvg = null;

                        // showing self loop
                        if (sourceNode == targetNode && showSelfLoop) {
                            const { x, y } = sourceNode;

                            const loopRadiusX = 1.1 * nodeRadius;
                            const loopRadiusY = 1.1 * nodeRadius;

                            const arrowOffset = isDirected ? arrowGap : 0;

                            // 10 o'clock start position
                            const startAngle = 210 * (Math.PI / 180);
                            const startPoint = `${x + nodeRadius * Math.cos(startAngle)},${y + nodeRadius * Math.sin(startAngle)
                                }`;

                            // 2 o'clock end position
                            const endAngle = 330 * (Math.PI / 180);
                            const endPoint = `${x + (nodeRadius + arrowOffset) * Math.cos(endAngle)
                                },${y + (nodeRadius + arrowOffset) * Math.sin(endAngle)}`;

                            pathSvg = `M${startPoint} A${loopRadiusX},${loopRadiusY} 0 1,1 ${endPoint}`;
                        } else {
                            let sx, sy, ex, ey;

                            if (isReversed) {
                                ({ x: sx, y: sy } = targetNode);
                                ({ x: ex, y: ey } = sourceNode);
                            } else {
                                ({ x: sx, y: sy } = sourceNode);
                                ({ x: ex, y: ey } = targetNode);
                            }

                            const dx = ex - sx;
                            const dy = ey - sy;

                            if (isDirected) {
                                const length = Math.sqrt(dx * dx + dy * dy);
                                if (length !== 0) {
                                    ex =
                                        sx +
                                        (dx / length) *
                                        (length - nodeRadius - arrowGap * 2 * sizeAdjust);
                                    ey =
                                        sy +
                                        (dy / length) *
                                        (length - nodeRadius - arrowGap * 2 * sizeAdjust);
                                }
                            }

                            if (this.props.data.isInterConnected(source, target)) {
                                const { cx, cy } = calculateControlCord(sx, sy, ex, ey);
                                pathSvg = `M${sx},${sy} Q${cx},${cy},${ex},${ey}`;
                            } else {
                                pathSvg = `M${sx},${sy} L${ex},${ey}`;
                            }
                        }
                        return (
                            <g
                                className={classes(
                                    styles.edge)}
                                key={`${source}-${target}`}
                            >
                                <path
                                    d={pathSvg}
                                    className={classes(
                                        styles.line,
                                        isDirected && styles.directed
                                    )}
                                />
                            </g>
                        );
                    })}

                {nodes.map((node) => {
                    const {
                        x,
                        y,
                        fill,
                        value,
                        shape,
                        key
                    } = node;
                    const varGreen = fill === 1;
                    const varOrange = fill === 2;
                    const varRed = fill === 3;
                    return (
                        <motion.g
                            animate={{ x, y }}
                            initial={false}
                            transition={{ duration: 1 }}
                            className={classes(
                                styles.node,
                                varGreen && styles.variableGreen,
                                varOrange && styles.variableOrange,
                                varRed && styles.variableRed,
                            )}
                            key={key}
                        >
                            {shape === 'square' ? (
                                <rect
                                    className={styles.circle}
                                    width={2 * nodeRadius}
                                    height={2 * nodeRadius}
                                    x={-nodeRadius}
                                    y={-nodeRadius}
                                />
                            ) : (
                                <circle
                                    className={classes(styles.circle)}
                                    r={nodeRadius}
                                />
                            )}
                            <text className={classes(styles.id)}>
                                {value}
                            </text>
                        </motion.g>
                    );
                })}
                <text className={classes(styles.text)} x="0" y={`${(dimensions.baseHeight / 2) - this.props.data.baseOffset}`}>
                    <tspan className={styles.pseudocode_function}>{this.props.data.functionName}</tspan>
                    {text}
                </text>
            </svg>
        );
    }
}

export default NAryTreeRenderer;