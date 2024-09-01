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
  let cx;
  let cy;
  let direction = y1 > y2 ? 1 : -1;

  if (Math.abs(y1 - y2) / Math.abs(x1 - x2) < 0.5) {
    direction = x1 > x2 ? 1 : -1;
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

    // XXX shouldn't rely on this.props.title
    // XXX This plus the code for axes and graph layout (eg layoutCircle()
    // and code where X-Y coordinates are explicitly given by the user) is
    // linked. Some magic numbers were added to shift things around and make
    // things look ok.  It should be rethought or at least the numbers for
    // this.centerX and this.centerY should be put in one place.
    if (this.props.title === 'Graph view') {
      // Center to new axis origin
      // this.centerX = 180;
      this.centerX = 650; // shift graph display left
      this.centerY = -200;
    }
    this.zoom = 0.85; // zoom out a bit to fit graph on screen

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
    // XXX would be nice to avoid selecting text with reverse video
    // as we move the mouse around!
    if (this.selectedNode && this.props.data.moveNode) {
      // Allow mouse to move nodes (for Euclidean graphs) if
      // this.props.data.moveNode function is defined
      const { x, y } = this.computeCoords(e);
      const node = this.props.data.findNode(this.selectedNode.id);
      const scaleSize = 30; // XXX should define globally in one spot!
      const scaledX = Math.round(x/scaleSize);
      const scaledY = -Math.round(y/scaleSize);
      if (scaledX > 0 && scaledY > 0) { // limit range, XXX add max?
        this.props.data.moveNode(node.id, scaledX, scaledY);
        node.x = x;
        node.y = y;
        this.refresh();
      }
    } else if (this.selectedNode) {
      // Ignore mouse movement if no moveNode function is defined
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

  /**
   * Compute the max x and y from nodes coordinates for auto scalling
   */
  computeMax(nodes) {
    var xMax = 0;
    var yMax = 0;

    const nodesXArr = [];
    const nodesYArr = [];
    for (const node of nodes) {
      const { x, y } = node;
      nodesXArr.push(x);
      nodesYArr.push(y);
    }
    xMax = Math.max.apply(null, nodesXArr.map(Math.abs));
    yMax = Math.max.apply(null, nodesYArr.map(Math.abs));
    return { x: xMax, y: yMax };
  }

  /**
   * Add scale tick marks to the axis
   */
  computeScales(
    min,
    max,
    center,
    stepSize = 30,
    stepHeight = 15, // size of scale mark tick on axes
    increment = 1
  ) {
    const scales = [];
    const alignMinX = center.x - stepHeight / 2;
    const alignMaxX = center.x + stepHeight / 2;
    const alignMinY = center.y - stepHeight / 2;
    const alignMaxY = center.y + stepHeight / 2;

    for (let i = increment; i <= (max - min) / stepSize; i += increment) {
      scales.push({
        label: 'x',
        x1: min + i * stepSize,
        x2: min + i * stepSize,
        y1: alignMinY,
        y2: alignMaxY,
        num: i,
      });
      scales.push({
        label: 'y',
        x1: alignMinX,
        x2: alignMaxX,
        y1: -(min + i) * stepSize,
        y2: -(min + i) * stepSize,
        num: i,
      });
    }

    return scales;
  }

  /**
   * Add arrows to the end of axis using two lines
   */
  computeArrows(label, axisEndPoint, length, width) {
    var arrow1;
    var arrow2;

    if (label === 'x') {
      arrow1 = {
        x1: axisEndPoint.x,
        y1: axisEndPoint.y,
        x2: axisEndPoint.x - length,
        y2: axisEndPoint.y - width / 2,
      };
      arrow2 = {
        x1: axisEndPoint.x,
        y1: axisEndPoint.y,
        x2: axisEndPoint.x - length,
        y2: axisEndPoint.y + width / 2,
      };
    } else if (label === 'y') {
      arrow1 = {
        x1: axisEndPoint.x,
        y1: -axisEndPoint.y,
        x2: axisEndPoint.x - width / 2,
        y2: -axisEndPoint.y + length,
      };
      arrow2 = {
        x1: axisEndPoint.x,
        y1: -axisEndPoint.y,
        x2: axisEndPoint.x + width / 2,
        y2: -axisEndPoint.y + length,
      };
    } else {
      arrow1 = {};
      arrow2 = {};
    }

    return [arrow1, arrow2];
  }

  /*
   * Calculate the scale of the x y axes dependant on the maximum x and y coordinates.
   */
  calculateAxisScale(maxScale, stepSize = 30) {
    const trueMax = Math.max(maxScale.x, maxScale.y) / stepSize; // Maximum individual coordinate value.

    // Determine scale up to multiple of 10.
    for (let i = 1; i < 10; ++i) {
      const maxCoord = 10 * i;
      if (trueMax < maxCoord) {
        return maxCoord * stepSize;
      }
    }

    const maxCoord = 100;
    return maxCoord * stepSize;
  }

  /*
   * Calculate value increment of axis coordinate labels.
   */
  calculateIncrement(axisScale, stepSize = 30) {
    const maxCoord = (axisScale /= stepSize); // The maximum coordinate each axis displays.
    if (maxCoord <= 20) {
      return 1;
    } else if (maxCoord <= 50) {
      return 5;
    }
    const maxIncrement = 10;
    return maxIncrement;
  }

  /*
   * Determine multiplier for size of all labels on the graph.
   */
  calculateLabelSizeMultiplier(axisScale, stepSize = 30) {
    const maxCoord = (axisScale /= stepSize); // The maximum coordinate each axis displays.
    for (let i = 1; i < 10; ++i) {
      if (maxCoord <= i * 10) {
        const multiplier = 1 + (i - 1) * 0.2;
        return multiplier;
      }
    }
  }

  /*
   * Render x y axis
   */
  renderAxis(maxScale) {
    const axisCenter = { x: 0, y: 0 }; // axis position

    // Scaling variables.
    const axisScale = this.calculateAxisScale(maxScale); // Largest coordinate value of each axis.
    const increment = this.calculateIncrement(axisScale); // Calculate value increment of axis coordinate labels.
    const labelMultiplier = this.calculateLabelSizeMultiplier(axisScale); // Multiplier for size of all labels.

    const scales = this.computeScales(
      0,
      axisScale,
      axisCenter,
      undefined,
      undefined,
      increment
    ); // list of scales

    const axisEndPoint = axisScale + 20;
    const axisArrowX = this.computeArrows(
      'x',
      { x: axisEndPoint, y: axisCenter.y },
      18,
      18
    ); // list containing fragments to form arrow on x
    const axisArrowY = this.computeArrows(
      'y',
      { x: axisCenter.x, y: axisEndPoint },
      18,
      18
    ); // list containing fragments to form arrow on y

    const labelPadding = 20;
    const labelPosX = axisEndPoint + labelPadding;
    const labelPosY = axisEndPoint + labelPadding;

    const originCoords = { x: axisCenter.x - 12, y: axisCenter.y + 16 };

    if (this.props.title !== 'Graph view') {
      // Do not render axis if its not graph
      return <g></g>;
    }

    return (
      <g>
        {/* Add X and Y Axis */}
        <line
          x1={0}
          y1={axisCenter.y}
          x2={axisEndPoint}
          y2={axisCenter.y}
          className={styles.axis}
        />

        <line
          x1={axisCenter.x}
          y1={0}
          x2={axisCenter.x}
          y2={-axisEndPoint}
          className={styles.axis}
        />

        {/* Arrow X */}
        {axisArrowX.map((frag) => {
          return (
            <line
              x1={frag.x1}
              y1={frag.y1}
              x2={frag.x2}
              y2={frag.y2}
              className={styles.axis}
            />
          );
        })}

        {/* Arrow Y */}
        {axisArrowY.map((frag) => {
          return (
            <line
              x1={frag.x1}
              y1={frag.y1}
              x2={frag.x2}
              y2={frag.y2}
              className={styles.axis}
            />
          );
        })}

        {/* X Axis Label */}
        <text
          x={labelPosX}
          y={axisCenter.y + 5}
          textAnchor="middle"
          className={styles.axisLabel}
        >
          x
        </text>

        {/* Y Axis Label */}
        <text
          x={axisCenter.x}
          y={-labelPosY}
          textAnchor="middle"
          className={styles.axisLabel}
        >
          y
        </text>

        {/* Origin Label */}
        <text
          x={originCoords.x}
          y={originCoords.y}
          textAnchor="middle"
          className={styles.axisLabel}
        >
          0
        </text>

        {/* Scales */}
        {scales.map((scale) => {
          if (scale.label === 'x') {
            return (
              <g>
                <line
                  x1={scale.x1}
                  y1={scale.y1}
                  x2={scale.x2}
                  y2={scale.y2}
                  className={styles.axis}
                />
                <text
                  x={scale.x1}
                  y={originCoords.y + 30}
                  textAnchor="middle"
                  className={styles.axisLabel}
                >
                  {' '}
                  {scale.num}{' '}
                </text>
              </g>
            );
          } else if (scale.label === 'y') {
            return (
              <g>
                <line
                  x1={scale.x1}
                  y1={scale.y1}
                  x2={scale.x2}
                  y2={scale.y2}
                  className={styles.axis}
                />
                <text
                  x={originCoords.x - 25}
                  y={scale.y1 + 6}
                  textAnchor="middle"
                  className={styles.axisLabel}
                >
                  {' '}
                  {scale.num}{' '}
                </text>
              </g>
            );
          }
        })}
      </g>
    );
  }

  renderData() {
    const { nodes, edges, isDirected, isWeighted, dimensions, text } =
      this.props.data;
    const {
      baseWidth,
      baseHeight,
      nodeRadius,
      arrowGap,
      nodeWeightGap,
      edgeWeightGap,
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

    return (
      <svg
        className={switchmode(mode())}
        viewBox={viewBox}
        ref={this.elementRef}
      >
        <defs>
          <marker
            id="markerArrow"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 L0,0" className={styles.arrow} />
          </marker>
          <marker
            id="markerArrowSelected"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path
              d="M0,0 L0,6 L6,3 L0,0"
              className={classes(styles.arrow, styles.selected)}
            />
          </marker>
          <marker
            id="markerArrowVisited"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path
              d="M0,0 L0,6 L6,3 L0,0"
              className={classes(styles.arrow, styles.visited)}
            />
          </marker>
          <marker
            id="markerArrowVisited1"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path
              d="M0,0 L0,6 L6,3 L0,0"
              className={classes(styles.arrow, styles.visited1)}
            />
          </marker>
          <marker
            id="markerArrowVisited2"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path
              d="M0,0 L0,6 L6,3 L0,0"
              className={classes(styles.arrow, styles.visited2)}
            />
          </marker>
          <marker
            id="markerArrowVisited3"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path
              d="M0,0 L0,6 L6,3 L0,0"
              className={classes(styles.arrow, styles.visited3)}
            />
          </marker>
          <marker
            id="markerArrowVisited4"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path
              d="M0,0 L0,6 L6,3 L0,0"
              className={classes(styles.arrow, styles.visited4)}
            />
          </marker>
        </defs>

        {/* X axis and Y axis */}
        {this.renderAxis(this.computeMax(nodes))}

        {edges
          .sort(
            (a, b) =>
              a.visitedCount -
              b.visitedCount +
              a.visitedCount1 -
              b.visitedCount1
          )
          .map((edge) => {
            const {
              source,
              target,
              weight,
              visitedCount,
              selectedCount,
              visitedCount0,
              visitedCount1,
              visitedCount2,
              visitedCount3,
              visitedCount4,
            } = edge;
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
                  !selectedCount && visitedCount && styles.visited,
                  visitedCount0 && styles.visited,
                  visitedCount1 && styles.visited1,
                  visitedCount2 && styles.visited2,
                  visitedCount3 && styles.visited3,
                  visitedCount4 && styles.visited4
                )}
                key={`${source}-${target}`}
              >
                <path
                  d={pathSvg}
                  className={classes(
                    styles.line,
                    isDirected && styles.directed
                  )}
                />
                {isWeighted && (
                  <g transform={`translate(${mx},${my})`}>
                    <text
                      className={styles.weight}
                      transform="rotate(0)"
                      y={-edgeWeightGap}
                    >
                      {this.toString(weight)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        {/* node graph */}
        {nodes.map((node) => {
          const {
            x,
            y,
            weight,
            visitedCount0,
            visitedCount,
            visitedCount1,
            visitedCount2,
            visitedCount3,
            visitedCount4,
            selectedCount,
            value,
            key,
            style,
            sorted,
            isPointer,
            pointerText,
          } = node;
          // only when selectedCount is 1, then highlight the node
          const selectNode = selectedCount === 1;
          const visitedNode0 = visitedCount0 === 1;
          const visitedNode = visitedCount === 1;
          const visitedNode1 = visitedCount1 === 1;
          const visitedNode2 = visitedCount2 === 1;
          const visitedNode3 = visitedCount3 === 1;
          const visitedNode4 = visitedCount4 === 1;
          return (
            <motion.g
              animate={{ x, y }}
              initial={false}
              transition={{ duration: 1 }}
              className={classes(
                styles.node,
                selectNode && styles.selected,
                sorted && styles.sorted,
                visitedNode0 && styles.visited0,
                visitedNode && styles.visited,
                visitedNode1 && styles.visited1,
                visitedNode2 && styles.visited2,
                visitedNode3 && styles.visited3,
                visitedNode4 && styles.visited4
              )}
              key={key}
            >
              <circle
                className={classes(
                  styles.circle,
                  style && style.backgroundStyle
                )}
                r={nodeRadius}
              />
              <text className={classes(styles.id, style && style.textStyle)}>
                {value}
              </text>
              {isWeighted && (
                <text className={styles.weight} x={nodeRadius + nodeWeightGap}>
                  {this.toString(weight)}
                </text>
              )}
              {isPointer && (
                <text className={styles.weight} x={nodeRadius + nodeWeightGap}>
                  {this.toString(pointerText)}
                </text>
              )}
            </motion.g>
          );
        })}
        <text
          style={{ fill: '#ff0000' }}
          textAnchor="middle"
          x={rootX}
          y={rootY - 20}
        >
          {text}
        </text>
      </svg>
    );
  }
}

export default GraphRenderer;
