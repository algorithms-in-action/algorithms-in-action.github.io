import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Array2DRenderer from '../../Array/Array2DRenderer';
import styles from './LinkedListRenderer.module.scss';

/**
 * LinkedListRenderer
 * - Visualizes a linked list with nodes (pills) and connecting arrows.
 * - Preserves the original color scheme via `n.fillVariant`.
 * - Automatically centers all visible nodes within a defined safe box.
 * - Includes a small offset adjustment for better visual composition.
 */
class LinkedListRenderer extends Array2DRenderer {
  constructor(props) {
    super(props);
    this.togglePan(true);
    this.toggleZoom(true);
  }

  // ---- Compute the visual bounds of all visible nodes (includes tag area) ----
  _getNodesBounds(list, tagBlockH = 24) {
    const visible = list.filter(n => !n.hidden);
    if (!visible.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };

    const NODE_W = 50, NODE_H = 20;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    visible.forEach(n => {
      // Offset used in rendering: left = n.pos.x - 60, top = n.pos.y - 10
      const left = n.pos.x - 60;
      const top = n.pos.y - 10;
      const right = left + NODE_W;
      const bottom = top + NODE_H + 6 + tagBlockH; // Node pill + tag area

      if (left < minX) minX = left;
      if (top < minY) minY = top;
      if (right > maxX) maxX = right;
      if (bottom > maxY) maxY = bottom;
    });

    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  // ---- Calculate offset to center all nodes within a safe visual box ----
  _getAutoOffset(bounds, safeBox, containerWidth) {
    const sx = Number.isFinite(safeBox?.x) ? safeBox.x : 0;
    const sy = Number.isFinite(safeBox?.y) ? safeBox.y : 0;
    const sw = Number.isFinite(safeBox?.width) ? safeBox.width : containerWidth;
    const sh = Number.isFinite(safeBox?.height) ? safeBox.height : 240;

    const groupCx = bounds.minX + bounds.width / 2;
    const groupCy = bounds.minY + bounds.height / 2;
    const safeCx = sx + sw / 2;
    const safeCy = sy + sh / 2;

    let offX = safeCx - groupCx;
    let offY = safeCy - groupCy;

    // Prevent overflow outside the safe box
    const after = {
      minX: bounds.minX + offX,
      maxX: bounds.maxX + offX,
      minY: bounds.minY + offY,
      maxY: bounds.maxY + offY,
    };
    if (after.minX < sx) offX += (sx - after.minX);
    if (after.maxX > sx + sw) offX -= (after.maxX - (sx + sw));
    if (after.minY < sy) offY += (sy - after.minY);
    if (after.maxY > sy + sh) offY -= (after.maxY - (sy + sh));

    return { offX, offY };
  }

  renderData() {
    const { nodes, layout } = this.props.data;
    const list = [...nodes.values()];

    // ---- Node geometry constants ----
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

    // Determine whether an edge should be curved based on distance
    const needsCurve = (fromNode, toNode) => {
      const dx = Math.abs(toNode.pos.x - fromNode.pos.x);
      const dy = Math.abs(toNode.pos.y - fromNode.pos.y);
      return dx > H_GAP * 1.5 || dy > 10;
    };

    // For now, keep edges straight (can be changed to quadratic Bézier later)
    const getCurvedPath = (x1, y1, x2, y2) => `M ${x1},${y1} L ${x2},${y2}`;

    // ---- Map fillVariant to CSS class ----
    const variantClass = (n) => {
      switch (n.fillVariant) {
        case 'orange':  return styles.variantOrange;
        case 'blue':    return styles.variantBlue;
        case 'green':   return styles.variantGreen;
        case 'red':     return styles.variantRed;
        case 'grayAlt': return styles.variantGrayAlt;
        case 'gray':
        default:        return styles.variantGray;
      }
    };

    // ---- Auto-centering with a small manual offset ----
    const safeBox = layout?.safeBox ?? { x: 0, y: 24, width: Infinity, height: 240 };
    const tagBlockH = layout?.tagBlockH ?? 24;
    const bounds = this._getNodesBounds(list, tagBlockH);
    const containerWidth = this.props.width || 800;
    const { offX, offY } = this._getAutoOffset(bounds, safeBox, containerWidth);

    const cameraTranslateX = (-this.centerX * 2) + offX - 100; // Horizontal offset
    const cameraTranslateY = (-this.centerY * 2) + offY - 30;  // Vertical offset

    return (
      <div className={styles.container}>
        <div
          className={styles.stage}
          style={{
            transform: `translate(${cameraTranslateX}px, ${cameraTranslateY}px) scale(${this.zoom})`,
            transformOrigin: '0 0',
            width: maxX,
            height: maxY,
            position: 'relative',
          }}
        >
          {/* ===== SVG Layer for edges (arrows) ===== */}
          <svg
            className={styles.edges}
            width={maxX}
            height={maxY}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', background: 'transparent' }}
          >
            <defs>
              {/* Arrowhead definition */}
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

          {/* ===== Animated Node Layer ===== */}
          <AnimateSharedLayout>
            {list.map(n => (
              <motion.div
                key={n.key}
                layout
                className={[
                  styles.node,
                  variantClass(n),             // Apply color variant
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
                {/* Node pill (main visual block) */}
                <div className={styles.pill}>
                  <span className={styles.value}>{n.value}</span>
                  <span className={styles.cap}>
                    <i className={styles.dot} aria-hidden />
                  </span>
                </div>

                {/* Tag / variable badges under each node */}
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
