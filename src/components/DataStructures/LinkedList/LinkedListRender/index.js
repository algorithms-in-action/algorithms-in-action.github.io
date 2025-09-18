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

    // === 尺寸（与 SCSS 保持一致）===
    const NODE_W = 60;
    const NODE_H = 24;
    const CAP_W  = 18;
    const DOT_SIZE  = 6;
    const DOT_RIGHT = (CAP_W - DOT_SIZE) / 2;

    // 由于 .node 使用 translate(-50%, -50%)，pos 即“中心坐标”
    const dotCenterX = n => n.pos.x + NODE_W / 2 - DOT_RIGHT - DOT_SIZE / 2;
    const dotCenterY = n => n.pos.y;

    // 让箭头停在下一个节点左边缘外一点
    const SAFE_GAP = 6;
    const targetX = to => to.pos.x - NODE_W / 2 - SAFE_GAP;
    const targetY = to => to.pos.y;

    const PADDING = 200;
    const maxX = (list.length ? Math.max(...list.map(n => n.pos.x)) : 0) + NODE_W + PADDING;
    const maxY = (list.length ? Math.max(...list.map(n => n.pos.y)) : 0) + NODE_H + PADDING;

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
          {/* ===== 箭头层（在节点之上） ===== */}
          <svg
            className={styles.edges}
            width={maxX}
            height={maxY}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' ,background: 'transparent'}}
          >
            <defs>
              {/* 实心尖头；盒子尺寸与尖端对齐，避免被裁掉 */}
              <marker
                id="arrow-dark"
                markerUnits="userSpaceOnUse"
                markerWidth="12"
                markerHeight="8"
                refX="12"
                refY="4"
                orient="auto"
                fill='none'
              >
                {/* 尖头三角形（与线条同色） */}
                <path d="M0,0 L12,4 L0,8 Z" fill = "currentColor" className={styles.arrowHead} />
              </marker>
            </defs>

            {list.map(n => {
              if (!n.nextKey) return null;
              const to = nodes.get(n.nextKey);
              if (!to) return null;
              

              const x1 = dotCenterX(n);
              const y1 = dotCenterY(n);
              const x2 = targetX(to);
              const y2 = targetY(to);

              return (
                <line
                  key={`e-${n.key}-${to.key}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeLinecap="butt" 
                  markerEnd="url(#arrow-dark)"
                  className={styles.edge}
                  vectorEffect="non-scaling-stroke"
                />
              );
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
                  left: n.pos.x,
                  top: n.pos.y,
                  width: NODE_W,
                  height: NODE_H,
                  '--node-w': `${NODE_W}px`,
                  '--node-h': `${NODE_H}px`,
                  '--cap-w':  `${CAP_W}px`,
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
