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
let lastnode = -1;
let repeatx = false;
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

class GraphRendererRect extends Renderer {
  constructor(props) {
    super(props);

    this.elementRef = React.createRef();
    this.selectedNode = null;
    this.ShowMsg = 0;
    this.shiftcount = 0;
    this.lastvisited = -1;
    this.hasGraph = false;
    this.graphFinished = false;

    this.togglePan(true);
    this.toggleZoom(true);
  }

  handleMouseDown(e) {
    super.handleMouseDown(e);
    const coords = this.computeCoords(e);
    const { nodes, dimensions } = this.props.data;
    const { nodeRadius } = dimensions;
    this.selectedNode = nodes.find((node) => distance(coords, node) <= nodeRadius);
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
      (this.centerX - baseWidth / 4) / this.zoom,
      (this.centerY - baseHeight / 4) / this.zoom,
      baseWidth / 2 / this.zoom,
      baseHeight / 2 / this.zoom,
    ];
    const root = nodes[0];
    let rootX = 0;
    let rootY = 0;
    if (root) {
      rootX = root.x;
      rootY = root.y;
    }
    let StringLen = 0;
    let PatternLen = 0;
    let FinalPostion = 0;
    const startpostion = nodes[0].x - 2 * nodeRadius;
    let algorithmName = '';

    if (nodes.length > 1) {
      StringLen = nodes[1].StringLen;
      PatternLen = nodes[1].PatternLen;
      if (nodes[1].algorithmName === 'bfsSearch') {
        algorithmName = 'bfsSearch';
        FinalPostion = nodes[StringLen - PatternLen - 1].x;
      }
      if (nodes[1].algorithmName === 'horspools') {
        algorithmName = 'horspools';
        FinalPostion = nodes[StringLen - 1].x;
      }
    }

    const strStart = nodes[0];
    const strEnd = nodes[StringLen - 1];
    let nodeid = 0;
    let smlx = FinalPostion;
    let smly = nodes[StringLen + 1].y;

    // eslint-disable-next-line no-plusplus
    for (let ii = 0; ii < nodes.length; ii++) {
      if (nodes[ii].y <= smly) {
        if (nodes[ii].x <= smlx) {
          smlx = nodes[ii].x;
          smly = nodes[ii].y;
          nodeid = nodes[ii].id;
        }
      }
    }

    for (let ii = 0; ii < nodes.length; ii++) {
      if (nodes[ii].y > 0) {
        if (nodes[ii].x === smlx) {
          if (nodes[ii].id === lastnode && repeatx) {
            this.shiftcount++;
            repeatx = false;
          } else if (nodes[ii].id === lastnode && !repeatx) {
            repeatx = true;
          } else {
            lastnode = nodes[ii].id;
            repeatx = false;
          }
          if (this.shiftcount > PatternLen) {
            this.shiftcount = PatternLen;
          }
        }
      }
    }

    let highlightid = -1;
    for (let ii = 0; ii < nodes.length; ii++) { // hl with lgr visit / lgr selectlimit
      // if (nodes[ii].visitedCount === 1){
      //   highlightid = nodes[ii].id
      // }
      if (nodes[ii].selectedCount === 1) {
        highlightid = nodes[ii].id;
      }
    }

    const testing = [];
    const currentPatStart = nodes[StringLen];
    const currentPatEnd = nodes[StringLen + PatternLen - 1];
    let lasthighlightj = nodes[StringLen];
    let lasthighlighti = nodes[PatternLen - 1];
    let highlighting = false;
    let accumj = 0;
    if (algorithmName === 'horspools') {
      for (let ii = 0; ii < StringLen; ii++) {
        if (nodes[ii].selectedCount === 1 || nodes[ii].visitedCount === 1) {
          lasthighlighti = nodes[ii];
          testing.push(nodes[ii]);
          highlighting = true;
          break;
        }
      }
      for (let ii = StringLen; ii >= StringLen && ii < StringLen + PatternLen; ii++) {
        if (nodes[ii].selectedCount === 1 || nodes[ii].visitedCount === 1) {
          lasthighlightj = nodes[ii];
          testing.push(nodes[ii]);
          if (nodes[ii].selectedCount === 1) { accumj = StringLen + PatternLen - ii; }
          break;
        }
      }
      console.log(`i=${lasthighlighti.id}\tj=${lasthighlightj.id}`);
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
        {edges
          .sort((a, b) => a.visitedCount - b.visitedCount)
          .map((edge) => {
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
            const degree = (Math.atan2(dy, dx) / Math.PI) * 180;
            if (isDirected) {
              const length = Math.sqrt(dx * dx + dy * dy);
              if (length !== 0) {
                ex = sx + (dx / length) * (length - nodeRadius - arrowGap);
                ey = sy + (dy / length) * (length - nodeRadius - arrowGap);
              }
            }

            return (
              <g
                className={classes(
                  styles.edge,
                  targetNode.sorted && styles.sorted,
                  selectedCount && styles.selected,
                  visitedCount && styles.visited,
                )}
                key={`${source}-${target}`}
              >
                <path d={`M${sx},${sy} L${ex},${ey}`} className={classes(styles.line, isDirected && styles.directed)} />
                {isWeighted && (
                  <g transform={`translate(${mx},${my})`}>
                    <text className={styles.weight} transform={`rotate(${degree})`} y={-edgeWeightGap}>
                      {this.toString(weight)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        {/* node graph */}
        {nodes.map((node) => {
          const { id, x, y, weight, visitedCount, selectedCount, value, key, style, sorted } = node;
          // only when selectedCount is 1, then highlight the node
          const selectNode = selectedCount === 1;
          const visitedNode = visitedCount === 1;
          return (
            <motion.g
                animate={{ x, y }}
                initial={false}
                transition={{ duration: 1 }}
                className={classes(styles.node, selectNode && styles.selected, sorted && styles.sorted, visitedNode && styles.visited)}
                key={key}
                // transform={`translate(${x},${y})`}
              >
              <rect className={styles.circle} width={2 * nodeRadius} height={2 * nodeRadius} x={-nodeRadius} y={-nodeRadius} />
              <text className={classes(styles.id, style && style.textStyle)}>{value}</text>
              {isWeighted && (
              <text className={styles.weight} x={nodeRadius + nodeWeightGap}>
                {this.toString(weight)}
              </text>
              )}
              {/* BFS */}
              {(id === nodeid && algorithmName === 'bfsSearch' ? <text style={{ fill: '#2986CC' }} y={-smly * 4} dy=".2em">i</text> : <></>)}
              {(id === nodeid && highlightid < 0 && algorithmName === 'bfsSearch' ? <text style={{ fill: '#2986CC' }} y={smly * 2} dy=".2em">j</text> : <></>)}
              {(id === highlightid && highlightid >= 0 && algorithmName === 'bfsSearch' ? <text style={{ fill: '#2986CC' }} y={smly * 2} dy=".2em">j</text> : <></>)}
              {/* HFS */}
              {/* {(id === currentPatEnd.id && currentPatStart.x !== strStart.x && testing.length <=0 && algorithmName === "horspools"? <text style={{ fill: "#2986CC" }}  y={lasthighlightj.y * 2} dy=".2em">j</text> : <></>)} */}
              {/* {(id === lasthighlightj.id && currentPatStart.x === strStart.x && !highlighting && testing.length >0 && algorithmName === "horspools"? <text style={{ fill: "#2986CC" }}  y={lasthighlightj.y * 2} dy=".2em">j</text> : <></>)} */}
              {(id === lasthighlightj.id && currentPatStart.x !== strStart.x && testing.length > 0 && algorithmName === 'horspools' ? <text style={{ fill: '#2986CC', textAlign: 'centre' }} y={lasthighlightj.y * 2} dy=".2em">m-j</text> : <></>)}
              {(id === lasthighlightj.id && currentPatStart.x !== strStart.x && testing.length > 0 && algorithmName === 'horspools' ? <text style={{ fill: '#2986CC', textAlign: 'centre' }} y={-lasthighlightj.y * 6} dy=".2em">i-j</text> : <></>)}
              {(id === lasthighlightj.id && id === currentPatEnd.id && currentPatStart.x === strStart.x && testing.length > 0 && algorithmName === 'horspools' ? <text style={{ fill: '#2986CC', textAlign: 'centre' }} y={lasthighlightj.y * 2} dy=".2em">m-j</text> : <></>)}
              {(id === lasthighlightj.id && id === currentPatEnd.id && currentPatStart.x === strStart.x && testing.length > 0 && algorithmName === 'horspools' ? <text style={{ fill: '#2986CC', textAlign: 'centre' }} y={-lasthighlightj.y * 6} dy=".2em">i-j</text> : <></>)}
              {(id === currentPatEnd.id && currentPatStart.x !== strStart.x && algorithmName === 'horspools' ? <text style={{ fill: '#2986CC' }} y={-lasthighlightj.y * 4} dy=".2em">i</text> : <></>)}
              {(id === currentPatEnd.id && currentPatStart.x === strStart.x && highlighting && algorithmName === 'horspools' ? <text style={{ fill: '#2986CC' }} y={-lasthighlightj.y * 4} dy=".2em">i</text> : <></>)}
              {(id === currentPatEnd.id && (currentPatStart.x !== strStart.x || currentPatStart.x === strStart.x && highlighting) && algorithmName === 'horspools' ? <text style={{ fill: '#2986CC' }} x={strEnd.x} y={lasthighlightj.y * 8} dy=".2em">j={accumj}</text> : <></>)}
              {/* {(id === currentPatEnd.id && currentPatStart.x === strStart.x && highlighting && algorithmName === "horspools"? <text style={{ fill: "#2986CC" }} x={strEnd.x} y={lasthighlightj.y * 8} dy=".2em">j={accumj}</text> : <></>)} */}
            </motion.g>
          );
        })}

        {/* Result message */}
        {nodes.map((node) => {
          const { id, x, y, visitedCount, Result } = node;
          // only when selectedCount is 1, then highlight the node
          const selectNode = visitedCount;
          // eslint-disable-next-line no-return-assign
          return (
            <g
              className={classes(styles.node, selectNode && styles.selected, visitedCount && styles.visited)}
              key={id}
              transform={`translate(${x},${y})`}
            >
              {
              this.toString(Result) !== null ?
                (this.ShowMsg += 1, this.ShowMsg = 1, <text x="-20%" y="20%" dy=".2em">{this.toString(Result)}</text>)
                :
                (this.ShowMsg === 0 && smlx !== FinalPostion && smlx > startpostion && nodeid === id ? (<text x="-10%" y="20%" dy=".2em">Keep Seaching</text>) : (<text />))
              }
              {smlx === startpostion ? (this.ShowMsg = 0) : (<text />)}
              {this.ShowMsg === 0 && smlx === FinalPostion && nodeid === id ? (<text x="-10%" y="20%" dy=".2em">Seaching Fail</text>) : (<text />)}
            </g>
          );
        })}
        <text style={{ fill: '#ff0000' }} textAnchor="middle" x={rootX} y={rootY - 20}>
          {text}
        </text>
      </svg>
    );
  }
}

export default GraphRendererRect;
