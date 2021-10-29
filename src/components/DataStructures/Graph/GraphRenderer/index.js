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
      (this.centerX - baseWidth / 2) * this.zoom,
      (this.centerY - baseHeight / 2) * this.zoom,
      baseWidth * this.zoom,
      baseHeight * this.zoom,
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
          <marker id="markerArrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <path d="M0,0 L0,4 L4,2 L0,0" className={styles.arrow} />
          </marker>
          <marker id="markerArrowSelected" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <path d="M0,0 L0,4 L4,2 L0,0" className={classes(styles.arrow, styles.selected)} />
          </marker>
          <marker id="markerArrowVisited" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <path d="M0,0 L0,4 L4,2 L0,0" className={classes(styles.arrow, styles.visited)} />
          </marker>
        </defs>
        {
          edges.sort((a, b) => a.visitedCount - b.visitedCount).map(edge => {
            const { source, target, weight, visitedCount, selectedCount } = edge;
            const sourceNode = this.props.data.findNode(source);
            const targetNode = this.props.data.findNode(target);
            if (!sourceNode || !targetNode) return undefined;
            const { x: sx, y: sy } = sourceNode;
            let { x: ex, y: ey } = targetNode;
            const mx = (sx + ex) / 2;
            const my = (sy + ey) / 2;
            const dx = ex - sx;
            const dy = ey - sy;
            const degree = Math.atan2(dy, dx) / Math.PI * 180;
            if (isDirected) {
              const length = Math.sqrt(dx * dx + dy * dy);
              if (length !== 0) {
                ex = sx + dx / length * (length - nodeRadius - arrowGap);
                ey = sy + dy / length * (length - nodeRadius - arrowGap);
              }
            }

            return (
              <g className={classes(styles.edge, selectedCount && styles.selected, visitedCount && styles.visited)}
                 key={`${source}-${target}`}>
                <path d={`M${sx},${sy} L${ex},${ey}`} className={classes(styles.line, isDirected && styles.directed)} />
                {
                  isWeighted &&
                  <g transform={`translate(${mx},${my})`}>
                    <text className={styles.weight} transform={`rotate(${degree})`}
                          y={-edgeWeightGap}>{this.toString(weight)}</text>
                  </g>
                }
              </g>
            );
          })
        }
        {
          nodes.map(node => {
            const { id, x, y, weight, visitedCount, selectedCount, value } = node;
            // only when selectedCount is 1, then highlight the node
            const selectNode = selectedCount === 1;
            return (
              <g className={classes(styles.node, selectNode && styles.selected, visitedCount && styles.visited)}
                 key={id} transform={`translate(${x},${y})`}>
                <circle className={styles.circle} r={nodeRadius} />
                <text className={styles.id}>{value}</text>
                {
                  isWeighted &&
                  <text className={styles.weight} x={nodeRadius + nodeWeightGap}>{this.toString(weight)}</text>
                }
              </g>
            );
          })
        }
        <text style={{ fill: '#ff0000' }} textAnchor="middle" x={rootX} y={rootY - 20}>{text}</text>
      </svg>
    );
  }
}

export default GraphRenderer;

