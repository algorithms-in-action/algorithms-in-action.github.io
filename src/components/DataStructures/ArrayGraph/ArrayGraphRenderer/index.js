/* eslint-disable react/no-array-index-key */
/* eslint-disable max-classes-per-file */
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
// eslint-disable-next-line
import React, { useContext } from 'react';
import Renderer from '../../common/Renderer/index';
import { classes, distance } from '../../common/util';
import styles from './ArrayGraphRenderer.module.scss';
import { mode } from '../../../top/Settings';

let modename;
function switchmode(modetype = mode()) {
  switch (modetype) {
    case 1:
      modename = styles.graph_green;
      break;
    case 2:
      modename = styles.graph_blue;
      break;
    default:
      modename = styles.graph;
  }
  return modename;
}

class Element {
  constructor(value) {
    this.value = value;
    this.patched = false;
    this.selected = false;
  }
}

class GraphRenderer extends Renderer {
  constructor(props) {
    super(props);

    this.elementRef = React.createRef();
    this.selectedNode = null;

    this.togglePan(true);
    this.toggleZoom(true);
  }

  componentWillUnmount() {
    sessionStorage.removeItem('quicksortPlay');
    sessionStorage.removeItem('isPivot');
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

  getArrayCenter(arr) {
    let l = 0;
    for (let index = 0; index < arr.length; index += 1) {
      const elem = arr[index];
      l += ((elem.toString().length * 8) + 2);
    }

    return this.toString(-(l / 2));
  }

  renderData() {
    const { nodes, edges, isDirected, isWeighted, dimensions } = this.props.data;
    const { baseWidth, baseHeight, nodeRadius, arrowGap, nodeWeightGap, edgeWeightGap } = dimensions;
    const quicksortPlay = sessionStorage.getItem('quicksortPlay') === 'true';
    const isPivot = sessionStorage.getItem('isPivot') === 'true';
    const arrayHeight = -16;
    const arrowLength = 12;
    const viewBox = [
      (this.centerX - baseWidth / 2) * this.zoom,
      (this.centerY - baseHeight / 2) * this.zoom,
      baseWidth * this.zoom,
      baseHeight * this.zoom,
    ];

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
            const my = (sy + (ey + arrayHeight)) / 2;
            const dx = ex - sx;
            const dy = (ey + arrayHeight) - sy;
            const degree = Math.atan2(dy, dx) / Math.PI * 180;
            if (isDirected) {
              const length = Math.sqrt(dx * dx + dy * dy);
              if (length !== 0) {
                ex = sx + dx / length * (length - nodeRadius - arrowGap);
                ey = sy + (dy + arrayHeight) / length * (length - nodeRadius - arrowGap) + arrowLength;
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

            let arr = [];
            if (typeof value === 'object') {
              arr = Object.values(value);
              if (arr.length === 0) {
                arr.push(' ');
              }
            } else {
              arr.push(value);
            }

            const data = [];
            for (let i = 0; i < arr.length; i += 1) {
              const elem = new Element();
              if (i === arr.length - 1 && arr[i] !== ' ') {
                elem.selected = true;
              }
              elem.value = arr[i];
              data.push(elem);
            }

            return (
              <g className={classes(styles.node, selectedCount && styles.selected, visitedCount && styles.visited)}
                key={id} transform={`translate(${x},${y})`}>
                <foreignObject width="100%" height="50px" x={this.getArrayCenter(arr)} y={arrayHeight}>
                  {/* <body xmlns="http://www.w3.org/1999/xhtml"> */}
                  <table className={styles.array_2d}>
                    <tbody>
                      <tr className={styles.row}>
                        {
                          data.map((elem, i) => (
                            <td
                              key={`${i}-${elem.value}`}
                              className={classes(styles.col, elem.selected && quicksortPlay && isPivot && styles.selected, elem.patched && styles.patched)}
                            >
                              <span className={styles.value}>{elem.value}</span>
                            </td>

                          ))
                        }
                      </tr>
                    </tbody>
                  </table>
                  {/* </body> */}
                </foreignObject>
                {
                  isWeighted &&
                  <text className={styles.weight} x={nodeRadius + nodeWeightGap}>{this.toString(weight)}</text>
                }
              </g>
            );
          })
        }
      </svg>
    );
  }
}

export default GraphRenderer;
