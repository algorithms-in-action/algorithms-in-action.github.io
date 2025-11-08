import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Array2DRenderer from '../../Array/Array2DRenderer';
import styles from './LinkedListRenderer.module.scss';

/**
 * LinkedListRenderer
 * Pointer-only linked list visualization with auto-centering and arrows.
 */
class LinkedListRenderer extends Array2DRenderer {
  constructor(props) {
    super(props);
    this.togglePan(true);
    this.toggleZoom(true);
  }

  _getNodesBounds(list, tagBlockH = 24) {
    const visible = list.filter(n => !n.hidden);
    if (!visible.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };

    const NODE_W = 50, NODE_H = 20;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    visible.forEach(n => {
      const left = n.pos.x - 60;
      const top = n.pos.y - 10;
      const right = left + NODE_W;
      const bottom = top + NODE_H + 6 + tagBlockH;

      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, right);
      maxY = Math.max(maxY, bottom);
    });

    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

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

    const NODE_W = 50;
    const NODE_H = 20;
    const CAP_W = 15;
    const DOT_SIZE = 5;
    const H_GAP = 40;

    const dotCenterX = n => n.pos.x - 19;
    const dotCenterY = n => n.pos.y;
    const targetX = to => to.pos.x - 29;
    const targetY = to => to.pos.y;

    const maxX = (list.length ? Math.max(...list.map(n => n.pos.x)) : 0) + NODE_W;
    const maxY = (list.length ? Math.max(...list.map(n => n.pos.y)) : 0) + NODE_H;

    const getPath = (x1, y1, x2, y2) => `M ${x1},${y1} L ${x2},${y2}`;

    const variantClass = n => {
      switch (n.fillVariant) {
        case 'orange': return styles.variantOrange;
        case 'blue': return styles.variantBlue;
        case 'green': return styles.variantGreen;
        case 'red': return styles.variantRed;
        default: return styles.variantGray;
      }
    };

    const safeBox = layout?.safeBox ?? { x: 0, y: 24, width: Infinity, height: 240 };
    const tagBlockH = layout?.tagBlockH ?? 24;
    const bounds = this._getNodesBounds(list, tagBlockH);
    const containerWidth = this.props.width || 800;
    const { offX, offY } = this._getAutoOffset(bounds, safeBox, containerWidth);

    const cameraTranslateX = (-this.centerX * 2) + offX - 100;
    const cameraTranslateY = (-this.centerY * 2) + offY - 30;

    return (
      <div className={styles.container}>
        <div className={styles.stage}
          style={{
            transform: `translate(${cameraTranslateX}px,${cameraTranslateY}px) scale(${this.zoom})`,
            transformOrigin: '0 0', width: maxX, height: maxY, position: 'relative'
          }}
        >
          {/* Arrows */}
          <svg className={styles.edges}
            width={maxX} height={maxY}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', background: 'transparent' }}
          >
            <defs>
              <marker id="arrow-dark" viewBox="0 0 5 8"
                markerUnits="userSpaceOnUse" markerWidth={6} markerHeight={9}
                refX={5} refY={4} orient="auto">
                <path d="M0,0 L5,4 L0,8 Z" fill="#ff3b3b" />
              </marker>
            </defs>

            {list.map(n => {
              if (!n.nextKey || n.hidden) return null;
              const to = nodes.get(n.nextKey);
              if (!to || to.hidden) return null;

              const x1 = dotCenterX(n);
              const y1 = dotCenterY(n);
              const x2 = targetX(to) - 25;
              const y2 = targetY(to);

              return (
                <path
                  key={`e-${n.key}-${to.key}`}
                  d={getPath(x1, y1, x2, y2)}
                  fill="none"
                  markerEnd="url(#arrow-dark)"
                  className={styles.edge}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Node layer */}
          <AnimateSharedLayout>
            {list.map(n => (
              !n.hidden && (
                <motion.div key={n.key} layout
                  className={[
                    styles.node,
                    variantClass(n),
                    n.hidden && styles.hidden,
                  ].filter(Boolean).join(' ')}
                  style={{ position: 'absolute', left: n.pos.x - 60, top: n.pos.y - 10, width: NODE_W, height: NODE_H }}
                  transition={{ duration: 0.25 }}
                >
                  <div className={styles.pill}>
                    <span className={styles.value}>{n.value}</span>
                    <span className={styles.cap}><i className={styles.dot} /></span>
                  </div>

                  <div className={styles.vars}>
                    {n.variables.map(v => (
                      <motion.div layoutId={`${n.key}-${v}`} key={v} className={styles.varBadge}>
                        {v}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </AnimateSharedLayout>
        </div>
      </div>
    );
  }
}

export default LinkedListRenderer;
