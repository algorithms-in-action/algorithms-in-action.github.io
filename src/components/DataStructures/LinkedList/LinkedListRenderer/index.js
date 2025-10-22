import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Array2DRenderer from '../../Array/Array2DRenderer';
import styles from './LinkedListRenderer.module.scss';

/**
 * LinkedListRenderer
 * - Visualizes a linked list: nodes (pills) + edges (SVG arrows).
 * - Inherits pan/zoom behavior from Array2DRenderer.
 * - Uses Framer Motion for smooth layout transitions.
 */
class LinkedListRenderer extends Array2DRenderer {
  constructor(props) {
    super(props);
    // Enable interactive panning and zooming from the base renderer
    this.togglePan(true);
    this.toggleZoom(true);
  }

  renderData() {
    const { nodes } = this.props.data;
    const list = [...nodes.values()];

    // ---- Node geometry (in pixels) ----
    const NODE_W = 50;
    const NODE_H = 20;
    const CAP_W = 15;
    const DOT_SIZE = 5;
    const DOT_RIGHT = (CAP_W - DOT_SIZE) / 2;

    const H_GAP = 40;

    const dotCenterX = n => n.pos.x + NODE_W / 2 - DOT_RIGHT - DOT_SIZE / 2 - 30;
    const dotCenterY = n => n.pos.y;

    const SAFE_GAP = 6;
    const targetX = to => to.pos.x - NODE_W / 2 - SAFE_GAP + 6;
    const targetY = to => to.pos.y;

    const PADDING = 0;
    const maxX = (list.length ? Math.max(...list.map(n => n.pos.x)) : 0) + NODE_W + PADDING;
    const maxY = (list.length ? Math.max(...list.map(n => n.pos.y)) : 0) + NODE_H + PADDING;

    const needsCurve = (fromNode, toNode) => {
      const dx = Math.abs(toNode.pos.x - fromNode.pos.x);
      const dy = Math.abs(toNode.pos.y - fromNode.pos.y);
      return dx > H_GAP * 1.5 || dy > 10;
    };

    const getCurvedPath = (x1, y1, x2, y2) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curveHeight = Math.min(80, distance * 0.5);
      const goingBackward = dx < 0;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      let cx, cy;
      if (goingBackward) { cx = mx; cy = my - curveHeight; }
      else { cx = mx; cy = my + curveHeight; }
      return `M ${x1},${y1} L ${x2},${y2}`;
      // To enable curves: return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
    };

    // Map node.fillVariant => css class
    const variantClass = (n) => {
      switch (n.fillVariant) {
        case 'orange': return styles.variantOrange;
        case 'blue':   return styles.variantBlue;
        case 'green':  return styles.variantGreen;
        case 'red':    return styles.variantRed;
        case 'grayAlt':return styles.variantGrayAlt;
        case 'gray':
        default:       return styles.variantGray;
      }
    };

    return (
      <div className={styles.container}>
        <div
          className={styles.stage}
          style={{
            transform: `translate(${-this.centerX * 2}px, ${-this.centerY * 2}px) scale(${this.zoom})`,
            transformOrigin: '0 0',
            width: maxX,
            height: maxY,
            position: 'relative',
          }}
        >
          {/* ===== Edges layer (SVG) ===== */}
          <svg
            className={styles.edges}
            width={maxX}
            height={maxY}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', background: 'transparent' }}
          >
            <defs>
              {(() => {
                const ARROW_LEN = 5;
                const ARROW_H = 8;
                const HALF_H = ARROW_H / 2;
                return (
                  <marker
                    id="arrow-dark"
                    viewBox={`0 0 ${ARROW_LEN} ${ARROW_H}`}
                    markerUnits="userSpaceOnUse"
                    markerWidth={ARROW_LEN * 1.2}
                    markerHeight={ARROW_H * 1.2}
                    refX={ARROW_LEN}
                    refY={HALF_H}
                    orient="auto"
                  >
                    <path d={`M0,0 L${ARROW_LEN},${HALF_H} L0,${ARROW_H} Z`} fill="#ff3b3b" />
                  </marker>
                );
              })()}
            </defs>

            {list.map(n => {
              if (!n.nextKey || n.hidden) return null;
              const to = nodes.get(n.nextKey);
              if (!to || to.hidden) return null;

              const x1 = dotCenterX(n);
              const y1 = dotCenterY(n);
              const BODY_GAP = 25;
              const x2 = targetX(to) - BODY_GAP;
              const y2 = targetY(to);

              const useCurve = needsCurve(n, to);
              if (useCurve) {
                return (
                  <path
                    key={`e-${n.key}-${to.key}`}
                    d={getCurvedPath(x1, y1, x2, y2)}
                    fill="none"
                    markerEnd="url(#arrow-dark)"
                    className={styles.edge}
                    vectorEffect="non-scaling-stroke"
                    shapeRendering="geometricPrecision"
                  />
                );
              } else {
                return (
                  <line
                    key={`e-${n.key}-${to.key}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    markerEnd="url(#arrow-dark)"
                    className={styles.edge}
                    vectorEffect="non-scaling-stroke"
                    shapeRendering="geometricPrecision"
                    strokeLinecap="butt"
                  />
                );
              }
            })}
          </svg>

          {/* ===== Nodes layer (animated layout) ===== */}
          <AnimateSharedLayout>
            {list.map(n => (
              <motion.div
                key={n.key}
                layout
                className={[
                  styles.node,
                  variantClass(n),             // <<< pick gradient by fillVariant
                  n.faded && styles.faded,
                  n.hidden && styles.hidden,
                  n.sorted && styles.sorted,
                  n.patched && styles.patched,
                  n.selected && styles.selected,
                  n.selected1 && styles.selected1,
                  n.selected2 && styles.selected2,
                  n.selected3 && styles.selected3,
                  n.selected4 && styles.selected4,
                  n.selected5 && styles.selected5,
                ].filter(Boolean).join(' ')}
                style={{
                  position: 'absolute',
                  left: n.pos.x - 60,
                  top: n.pos.y - 10,
                  width: NODE_W,
                  height: NODE_H,
                  '--node-w': `${NODE_W}px`,
                  '--node-h': `${NODE_H}px`,
                  '--cap-w': `${CAP_W}px`,
                  '--dot-size': `${DOT_SIZE}px`,
                  '--dot-right': `${DOT_RIGHT}px`,
                }}
                transition={{ duration: 0.25 }}
              >
                <div className={styles.pill}>
                  <span className={styles.value}>{n.value}</span>
                  <span className={styles.cap}>
                    <i className={styles.dot} aria-hidden />
                  </span>
                </div>

                <div className={styles.vars}>
                  {n.variables.map(v => (
                    <motion.div
                      layoutId={`${n.key}-${v}`}
                      key={v}
                      className={styles.varBadge}
                    >
                      {v}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimateSharedLayout>
        </div>
      </div>
    );
  }
}

export default LinkedListRenderer;
