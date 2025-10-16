import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Array2DRenderer from '../../Array/Array2DRenderer';
import styles from './LinkedListRenderer.module.scss';

class LinkedListRenderer extends Array2DRenderer {
  constructor(props) {
    super(props);
    this.togglePan(true);
    this.toggleZoom(true);
  }

  renderData() {
    const { nodes } = this.props.data;
    const list = [...nodes.values()];

    const NODE_W = 50;
    const NODE_H = 20;
    const CAP_W = 15;
    const DOT_SIZE = 5;
    const DOT_RIGHT = (CAP_W - DOT_SIZE) / 2;

    const H_GAP = 40;

    const dotCenterX = n => n.pos.x + NODE_W / 2 - DOT_RIGHT - DOT_SIZE / 2 - 30;
    const dotCenterY = n => n.pos.y;

    const SAFE_GAP = 6;
    const targetX = to => to.pos.x - NODE_W / 2 - SAFE_GAP;
    const targetY = to => to.pos.y;

    const PADDING = 0;
    const maxX = (list.length ? Math.max(...list.map(n => n.pos.x)) : 0) + NODE_W + PADDING;
    const maxY = (list.length ? Math.max(...list.map(n => n.pos.y)) : 0) + NODE_H + PADDING;

    // **NEW: Function to calculate if arrow needs curve**
    const needsCurve = (fromNode, toNode) => {
      const dx = Math.abs(toNode.pos.x - fromNode.pos.x);
      const dy = Math.abs(toNode.pos.y - fromNode.pos.y);

      // If skipping nodes (large horizontal distance) or different rows
      return dx > H_GAP * 1.5 || dy > 10;
    };

    // **UPDATED: Generate more pronounced curved path**
    const getCurvedPath = (x1, y1, x2, y2) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // **INCREASED curve height for more pronounced curves**
      const curveHeight = Math.min(80, distance * 0.5); // Was 40 and 0.3

      // Determine if arrow goes backward (right to left)
      const goingBackward = dx < 0;

      // Midpoint
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;

      // Control point
      let cx, cy;

      if (goingBackward) {
        // For backward arrows, curve upward more dramatically
        cx = mx;
        cy = my - curveHeight; // Curve upward
      } else {
        // For forward long arrows, curve downward
        cx = mx;
        cy = my + curveHeight; // Curve downward
      }

      // Quadratic bezier curve
      return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
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
          {/* ===== 箭头层 ===== */}
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
                    markerWidth={ARROW_LEN}
                    markerHeight={ARROW_H}
                    refX={ARROW_LEN}
                    refY={HALF_H}
                    orient="auto"
                  >
                    <path d={`M0,0 L${ARROW_LEN},${HALF_H} L0,${ARROW_H} Z`} fill="currentColor" />
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

              // **NEW: Use curved path for long-distance arrows**
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
                // Use straight line for adjacent nodes
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

          {/* ===== 节点层 ===== */}
          <AnimateSharedLayout>
            {list.map(n => (
              <motion.div
                key={n.key}
                layout
                className={[
                  styles.node,
                  styles.variantGray,
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
                  left: n.pos.x - 30,
                  top: n.pos.y,
                  width: NODE_W,
                  height: NODE_H,
                  '--node-w': `${NODE_W}px`,
                  '--node-h': `${NODE_H}px`,
                  '--cap-w': `${CAP_W}px`,
                  '--dot-size': `${DOT_SIZE}px`,
                  '--dot-right': `${DOT_RIGHT}px`,
                }}
                transition={{ duration: 0.45 }}
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
