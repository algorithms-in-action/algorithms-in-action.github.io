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

  // —— 尺寸与偏移（可按需要统一调整）——
  const NODE_W = 35;          // 节点宽（比之前更宽一点）
  const NODE_H = 40;           // 节点高
  const PADDING = 120;         // 画布留白，避免裁剪
  const START_OFFSET = NODE_W - 12;   // 箭头起点（离起点右边框 12px）
  const END_OFFSET   = 12;            // 箭头终点（离终点左边框 12px）
  const NODE_CY = NODE_H / 2;

  // —— 计算“舞台”尺寸，覆盖所有节点 —— //
  const maxX = (list.length ? Math.max(...list.map(n => n.pos.x)) : 0) + NODE_W + PADDING;
  const maxY = (list.length ? Math.max(...list.map(n => n.pos.y)) : 0) + NODE_H + PADDING;

  return (
    <div className={styles.container}>
      {/* 舞台：统一缩放/平移只作用在这里 */}
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
        {/* 箭头层（SVG 铺满舞台） */}
        <svg
          className={styles.edges}
          width={maxX}
          height={maxY}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          <defs>
            {/* userSpaceOnUse + non-scaling-stroke 可保持线宽/箭头在缩放时观感更稳定 */}
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L0,6 L9,3 z" className={styles.arrowHead} />
            </marker>
          </defs>

          {list.map(n => {
            if (!n.nextKey) return null;
            const to = nodes.get(n.nextKey);
            if (!to) return null;

            return (
              <line
                key={`e-${n.key}-${to.key}`}
                x1={n.pos.x + START_OFFSET}
                y1={n.pos.y + NODE_CY}
                x2={to.pos.x + END_OFFSET}
                y2={to.pos.y + NODE_CY}
                markerEnd="url(#arrow)"
                className={styles.edge}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* 节点层（和 SVG 在同一“舞台”坐标系下） */}
        <AnimateSharedLayout>
          {list.map(n => (
            <motion.div
              key={n.key}
              layout
              className={[
                styles.node,
                n.faded && styles.faded,
                n.selected && styles.selected,
                n.selected1 && styles.selected1,
                n.selected2 && styles.selected2,
                n.selected3 && styles.selected3,
                n.selected4 && styles.selected4,
                n.selected5 && styles.selected5,
                n.patched && styles.patched,
                n.sorted && styles.sorted,
              ].filter(Boolean).join(' ')}
              style={{
                position: 'absolute',
                left: n.pos.x,
                top: n.pos.y,
                width: NODE_W,
                height: NODE_H,
              }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.value}>{n.value}</div>
              <div className={styles.vars}>
                {n.variables.map(v => (
                  <motion.div layoutId={`${n.key}-${v}`} key={v} className={styles.varBadge}>
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
