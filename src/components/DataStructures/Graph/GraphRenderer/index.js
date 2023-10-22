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
import styles from './GraphRenderer.module.scss';
import { mode } from '../../../top/Settings';

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

export function calculateControlCord(x1, y1, x2, y2) {
  // Slope for line that perpendicular to (x1,y1) (x2,y2)
  const slope = -(x2 - x1) / (y2 - y1);
  let cx; let cy;
  let direction = (y1 > y2) ? 1 : -1;

  if (Math.abs(y1 - y2) / Math.abs(x1 - x2) < 0.5) {
    direction = (x1 > x2) ? 1 : -1;
    cx = (x2 + x1) / 2;
    cy = (y1 + y2) / 2 + direction * 30;
  } else {
    cx = (x2 + x1) / 2 + direction * 30;
    cy = slope * (cx - (x1 + x2) / 2) + (y1 + y2) / 2;
  }
  return { cx, cy };
}

class GraphRenderer extends Renderer {
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
    this.selectedNode = nodes.find(node => distance(coords, node) <= nodeRadius);
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
    const { nodes, edges, isDirected, isWeighted, dimensions, text } = this.props.data;
    const { baseWidth, baseHeight, nodeRadius, arrowGap, nodeWeightGap, edgeWeightGap } = dimensions;
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
    return (
      <svg className={switchmode(mode())} viewBox={viewBox} ref={this.elementRef}>
        <defs>
          <marker id="markerArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 L0,0" className={styles.arrow} />
          </marker>
          <marker id="markerArrowSelected" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 L0,0" className={classes(styles.arrow, styles.selected)} />
          </marker>
          <marker id="markerArrowVisited" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 L0,0" className={classes(styles.arrow, styles.visited)} />
          </marker>
          <marker id="markerArrowVisited1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 L0,0" className={classes(styles.arrow, styles.visited1)} />
          </marker>
          <marker id="markerArrowVisited2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 L0,0" className={classes(styles.arrow, styles.visited2)} />
          </marker>
        </defs>
        {
          edges.sort((a, b) => a.visitedCount - b.visitedCount + a.visitedCount1 - b.visitedCount1).map(edge => {
            const { source, target, weight, visitedCount, selectedCount, visitedCount0, visitedCount1, visitedCount2 } = edge;
            const sourceNode = this.props.data.findNode(source);
            const targetNode = this.props.data.findNode(target);
            if (!sourceNode || !targetNode) return undefined;
            const { x: sx, y: sy } = sourceNode;
            let { x: ex, y: ey } = targetNode;
            const mx = (sx + ex) / 2;
            const my = (sy + ey) / 2;
            const dx = ex - sx;
            const dy = ey - sy;
            if (isDirected) {
              const length = Math.sqrt(dx * dx + dy * dy);
              if (length !== 0) {
                ex = sx + (dx / length) * (length - nodeRadius - arrowGap);
                ey = sy + (dy / length) * (length - nodeRadius - arrowGap);
              }
            }
            let pathSvg = null;
            if (this.props.data.isInterConnected(source, target)) {
              const { cx, cy } = calculateControlCord(sx, sy, ex, ey);
              pathSvg = `M${sx},${sy} Q${cx},${cy},${ex},${ey}`;
            } else {
              pathSvg = `M${sx},${sy} L${ex},${ey}`;
            }
            // console.log(sx,sy,ex,ey,cx,cy);
            return (
              <g
                className={classes(
                  styles.edge,
                  targetNode.sorted && styles.sorted,
                  selectedCount && styles.selected,
                  !selectedCount && visitedCount && styles.visited, visitedCount0 && styles.visited,
                  visitedCount1 && styles.visited1, visitedCount2 && styles.visited2,
                )}
                key={`${source}-${target}`}
              >
                <path d={pathSvg} className={classes(styles.line, isDirected && styles.directed)} />
                {
                  isWeighted &&
                  <g transform={`translate(${mx},${my})`}>
                    <text className={styles.weight} transform="rotate(0)"
                      y={-edgeWeightGap}>{this.toString(weight)}</text>
                  </g>
                }
              </g>
            );
          })
        }
        {/* node graph */}
        {nodes.map((node) => {
          const { x, y, weight, visitedCount0, visitedCount, visitedCount1, visitedCount2, selectedCount, value, key, style, sorted, isPointer, pointerText } = node;
          // only when selectedCount is 1, then highlight the node
          const selectNode = selectedCount === 1;
          const visitedNode0 = visitedCount0 === 1;
          const visitedNode = visitedCount === 1;
          const visitedNode1 = visitedCount1 === 1;
          const visitedNode2 = visitedCount2 === 1;
          return (
            <motion.g
              animate={{ x, y }}
              initial={false}
              transition={{ duration: 1 }}
              className={classes(styles.node, selectNode && styles.selected, sorted && styles.sorted, visitedNode0 && styles.visited0, visitedNode && styles.visited, visitedNode1 && styles.visited1, visitedNode2 && styles.visited2)}
              key={key}
            >
              <circle className={classes(styles.circle, style && style.backgroundStyle)} r={nodeRadius} />
              <text className={classes(styles.id, style && style.textStyle)}>{value}</text>
              {
                isWeighted && (
                  <text className={styles.weight} x={nodeRadius + nodeWeightGap}>
                    {this.toString(weight)}
                  </text>
                )
              }
              {
                isPointer &&
                <text className={styles.weight} x={nodeRadius + nodeWeightGap}>{this.toString(pointerText)}</text>
              }
            </motion.g>
          );
        })}
        <text style={{ fill: '#ff0000' }} textAnchor="middle" x={rootX} y={rootY - 20}>{text}</text>
      </svg>
    );
  }
}

export default GraphRenderer;