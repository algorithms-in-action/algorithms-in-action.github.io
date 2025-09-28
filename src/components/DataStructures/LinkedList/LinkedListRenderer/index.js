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
    const NODE_W = 50;
    const NODE_H = 20;
    const CAP_W  = 15;
    const DOT_SIZE  = 5;
    const DOT_RIGHT = (CAP_W - DOT_SIZE) / 2;

    const H_GAP = 40; // 自定义间距

    // 由于 .node 使用 translate(-50%, -50%)，pos 即“中心坐标”
    //const dotCenterX = n => n.pos.x + NODE_W/2 - DOT_RIGHT - DOT_SIZE/2 + n.index * H_GAP;
    const dotCenterX = n => n.pos.x + NODE_W / 2 - DOT_RIGHT - DOT_SIZE / 2 - 30;
    const dotCenterY = n => n.pos.y;

    // 让箭头停在下一个节点左边缘外一点
    const SAFE_GAP = 6;
    const targetX = to => to.pos.x - NODE_W / 2 - SAFE_GAP;
    const targetY = to => to.pos.y;

    const PADDING = 0;
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
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', background: 'transparent' }}
          >
            <defs>
              {/*
                ARROW_LEN = 三角形的水平长度（越小越短）
                ARROW_H   = 三角形的总高度（上下各一半）
              */}
              {(() => {
                const ARROW_LEN = 5; // ← 改这里：比如 6 / 5 / 4
                const ARROW_H   = 8; // 高度，通常保持 8 不动
                const HALF_H    = ARROW_H / 2;

      return (
        <marker
          id="arrow-dark"
          viewBox={`0 0 ${ARROW_LEN} ${ARROW_H}`} // 一定要和 path / refX 对齐
          markerUnits="userSpaceOnUse"
          markerWidth={ARROW_LEN}
          markerHeight={ARROW_H}
          refX={ARROW_LEN}
          refY={HALF_H}
          orient="auto"
        >
          {/* 尖头三角形（颜色跟随线条） */}
          <path d={`M0,0 L${ARROW_LEN},${HALF_H} L0,${ARROW_H} Z`} fill="currentColor" />
        </marker>
        );
        })()}
      </defs>

        {list.map(n => {
        if (!n.nextKey || n.hidden) return null;  // 没有 nextKey 或 节点隐藏时，不画箭头
        const to = nodes.get(n.nextKey);
        if (!to || to.hidden) return null;  // 指向的节点不存在或隐藏时，不画箭头

        const x1 = dotCenterX(n);
        const y1 = dotCenterY(n);

        // 如果还想让“整条线”再短点（不是只有三角形短），就把 BODY_GAP 调大一些
        const BODY_GAP = 25;                    // ← 例如设成 2 或 4
        const x2 = targetX(to) - BODY_GAP;     // 线的终点往回收
        const y2 = targetY(to);
        

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
                  n.hidden && styles.hidden,  // 支持隐藏
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
