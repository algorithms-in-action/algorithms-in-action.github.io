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

    if (!visible.length) {
      return {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0,
        width: 0,
        height: 0,
      };
    }

    const NODE_W = 50;
    const NODE_H = 20;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

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

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  _getAutoOffset(bounds, safeBox, containerWidth) {
    const sx = Number.isFinite(safeBox?.x)
      ? safeBox.x
      : 0;

    const sy = Number.isFinite(safeBox?.y)
      ? safeBox.y
      : 0;

    const sw = Number.isFinite(safeBox?.width)
      ? safeBox.width
      : containerWidth;

    const sh = Number.isFinite(safeBox?.height)
      ? safeBox.height
      : 240;

    const groupCx =
      bounds.minX + bounds.width / 2;

    const groupCy =
      bounds.minY + bounds.height / 2;

    const safeCx =
      sx + sw / 2;

    const safeCy =
      sy + sh / 2;

    let offX =
      safeCx - groupCx;

    let offY =
      safeCy - groupCy;

    const after = {
      minX: bounds.minX + offX,
      maxX: bounds.maxX + offX,
      minY: bounds.minY + offY,
      maxY: bounds.maxY + offY,
    };

    if (after.minX < sx) {
      offX += sx - after.minX;
    }

    if (after.maxX > sx + sw) {
      offX -=
        after.maxX -
        (sx + sw);
    }

    if (after.minY < sy) {
      offY += sy - after.minY;
    }

    if (after.maxY > sy + sh) {
      offY -=
        after.maxY -
        (sy + sh);
    }

    return {
      offX,
      offY,
    };
  }

  renderData() {
    const {
      nodes,
      layout,
      motionOn,
    } = this.props.data;

    const tweenDuration = motionOn === false ? 0 : 0.25;
    const isBupLabelLayout = layout?.labelLayout === 'bup';

    const list =
      [...nodes.values()];


    const NODE_W = 50;
    const NODE_H = 20;

    const CAP_W = 15;

    const VALUE_W =
      NODE_W - CAP_W;

    /*
     * Corrects the SVG position so that
     * the arrow begins exactly at the
     * visual centre of the rendered dot.
     */
    const DOT_X_OFFSET = -6;
    const DOT_Y_OFFSET = 0;

    /*
     * Length of the triangular arrowhead.
     *
     * The shaft stops this far before
     * the actual destination.
     */
    const ARROW_HEAD_LENGTH = 6;
    const ARROW_HEAD_HEIGHT = 9;
    const TARGET_GAP = 2.4;

    /*
     * Rectangle occupied by the VALUE
     * section of a node.
     */
    const getValueRect = n => {
      const nodeLeft =
        n.pos.x - 60 + contentOffsetX;

      const nodeTop =
        n.pos.y -
        NODE_H / 2;

      return {
        left:
          nodeLeft,

        right:
          nodeLeft +
          VALUE_W,

        top:
          nodeTop,

        bottom:
          nodeTop +
          NODE_H,
      };
    };

    /*
     * Exact visual centre of the pointer dot.
     */
    const getDotCenter = n => {
      const nodeLeft =
        n.pos.x - 60 + contentOffsetX;

      return {
        x:
          nodeLeft +
          VALUE_W +
          CAP_W / 2 +
          DOT_X_OFFSET,

        y:
          n.pos.y +
          DOT_Y_OFFSET,
      };
    };

    /*
     * Centre of the VALUE portion.
     */
      const getValueCenter = n => {
        const nodeLeft =
          n.pos.x - 60 + contentOffsetX;

        return {
          x:
            nodeLeft +
            NODE_W / 4,

          y:
            n.pos.y,
        };
      };

    /*
     * Determine exactly where the arrowhead
     * should touch the destination VALUE box.
     *
     * IMPORTANT:
     *
     * If the destination is above the source,
     * the arrow MUST hit the bottom edge of
     * the VALUE box.
     *
     * If the destination is below the source,
     * the arrow MUST hit the top edge.
     *
     * For nodes on the same row, use the
     * appropriate horizontal edge.
     *
     * This prevents an up-left arrow from
     * accidentally terminating on the
     * HEAD / pointer portion of the node.
     */
    const getTargetBoundary = (
      source,
      targetRect,
      targetCenter
    ) => {
      /*
       * Target is ABOVE source.
       *
       * Always hit the BOTTOM of the
       * VALUE box, directly beneath
       * the value.
       */
      if (
        targetCenter.y <
        source.y
      ) {
        return {
          x:
            targetCenter.x,

          y:
            targetRect.bottom,
        };
      }

      /*
       * Target is BELOW source.
       *
       * Always hit the TOP of the
       * VALUE box, directly above
       * the value.
       */
      if (
        targetCenter.y >
        source.y
      ) {
        return {
          x:
            targetCenter.x,

          y:
            targetRect.top,
        };
      }

      /*
       * Same row.
       *
       * Source is on the LEFT,
       * so hit destination's
       * LEFT edge.
       */
      if (
        source.x <
        targetCenter.x
      ) {
        return {
          x:
            targetRect.left,

          y:
            targetCenter.y,
        };
      }

      /*
       * Same row.
       *
       * Source is on the RIGHT,
       * so hit destination's
       * RIGHT edge.
       */
      return {
        x:
          targetRect.right,

        y:
          targetCenter.y,
      };
    };

    const maxX =
      (list.length
        ? Math.max(...list.map(n => n.pos.x))
        : 0) + NODE_W;

    const maxY =
      (list.length
        ? Math.max(...list.map(n => n.pos.y))
        : 0) + NODE_H;

    const getPath = (x1, y1, x2, y2) =>
      `M ${x1},${y1} L ${x2},${y2}`;

    const variantClass = n => {
      switch (n.fillVariant) {
        case 0:
          return styles.variantSky;

        case 1:
          return styles.variantLeaf;

        case 2:
          return styles.variantApple;

        case 3:
          return styles.variantPeach;

        default:
          return styles.variantStone;
      }
    };

    const safeBox =
      layout?.safeBox ?? {
        x: 0,
        y: 24,
        width: Infinity,
        height: 240,
      };

    const tagBlockH = layout?.tagBlockH ?? 24;

    const bounds = this._getNodesBounds(
      list,
      tagBlockH
    );


    const containerWidth =
      this.props.width || 800;


    // const cameraTranslateX =
    //   (-this.centerX * 2) + offX - 100;

    // const cameraTranslateY =
    //   (-this.centerY * 2) + offY - 30;

    const cameraTranslateX = 0;
    const cameraTranslateY = 0;

    const LEFT_PADDING = 80;
    const RIGHT_PADDING = 40;
    const currentContentWidth = bounds.width + LEFT_PADDING + RIGHT_PADDING;

  const layoutKey = `${containerWidth}-${list.length}`;

  if (this.layoutKey !== layoutKey) {
    this.layoutKey = layoutKey;
     const listStartX = currentContentWidth <= containerWidth
        ? (containerWidth - bounds.width) / 2  : 20;

    // Keep this offset fixed during the animation.
    this.contentOffsetX = listStartX - bounds.minX + 60;

    this.contentWidth = Math.max(containerWidth, currentContentWidth);
  } else {
    // Do not allow the stage to suddenly shrink during merge.
    this.contentWidth = Math.max(this.contentWidth, containerWidth, currentContentWidth);
  }
    const contentWidth = this.contentWidth;
    const contentOffsetX = this.contentOffsetX;

    // Get all currently visible nodes
    // const visibleNodes = list.filter(n => !n.hidden);

    const visibleNodes = list.filter(n => !n.hidden && !n.isReference);

    // Collect all row y positions and sort them from top to bottom
    const rowYs = [...new Set(visibleNodes.map(n => n.pos.y))].sort((a, b) => a - b);

    // Top row y position
    const topRowY = rowYs.length ? rowYs[0] : undefined;

    // Bottom row y position
    const bottomRowY = rowYs.length ? rowYs[rowYs.length - 1] : undefined;

    return (
      <div className={styles.container}>
        <div
          className={styles.value}
          style={{
             width: '100%',
             textAlign: 'center',
             transform: 'translateY(-15px)',
          }}
        >
           {this.props.data.caption}
        </div>

        <div
          className={styles.scrollWrapper}
        >
          <div
            className={styles.stage}
            style={{
              width: contentWidth,
              margin: 0,
              height: Math.max(maxY + tagBlockH + 50, 0),
              transform: `scale(${this.zoom})`,
            }}
          >

          {/* ========================= */}
          {/* ARROW LAYER               */}
          {/* ========================= */}

          <svg
            className={styles.edges}
            width={contentWidth}
            height={maxY}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'visible',
              background: 'transparent',
            }}
          >
            <defs>
              <marker
                id="arrow-dark"

                viewBox={
                  `0 0 ` +
                  `${ARROW_HEAD_LENGTH} ` +
                  `${ARROW_HEAD_HEIGHT}`
                }

                markerUnits={
                  'userSpaceOnUse'
                }

                markerWidth={
                  ARROW_HEAD_LENGTH
                }

                markerHeight={
                  ARROW_HEAD_HEIGHT
                }

                /*
                 * Attach the end of the shaft
                 * to the BASE of the triangle.
                 */
                refX={0}

                refY={
                  ARROW_HEAD_HEIGHT /
                  2
                }

                orient="auto"
              >
                <path
                  d={
                    `M0,0 ` +
                    `L${ARROW_HEAD_LENGTH},` +
                    `${ARROW_HEAD_HEIGHT / 2} ` +
                    `L0,${ARROW_HEAD_HEIGHT} Z`
                  }

                  className={
                    styles.arrowHead
                  }
                />
              </marker>
            </defs>

            {list.map(n => {
              /*
               * No arrow if the node
               * points nowhere.
               */
              if (
                !n.nextKey ||
                n.hidden
              ) {
                return null;
              }

              const to =
                nodes.get(
                  n.nextKey
                );

              if (
                !to ||
                to.hidden
              ) {
                return null;
              }

              /*
               * Arrow starts EXACTLY
               * at the source dot.
               */
              const sourceDot =
                getDotCenter(n);

              /*
               * Destination geometry.
               */
              const targetRect =
                getValueRect(to);

              const targetCenter =
                getValueCenter(to);

              /*
               * Exact location where
               * the arrowhead TIP should
               * touch the VALUE box.
               */
              const targetBoundary =
                getTargetBoundary(
                  sourceDot,
                  targetRect,
                  targetCenter
                );

              /*
               * Direction from source dot
               * to final arrowhead tip.
               */
              const dx =
                targetBoundary.x -
                sourceDot.x;

              const dy =
                targetBoundary.y -
                sourceDot.y;

              const length =
                Math.sqrt(
                  dx * dx +
                  dy * dy
                );

              const ux =
                length
                  ? dx / length
                  : 0;

              const uy =
                length
                  ? dy / length
                  : 0;

              /*
               * Stop the LINE before
               * the actual destination.
               *
               * The triangular marker
               * occupies these final
               * ARROW_HEAD_LENGTH pixels.
               */
              const isDiagonal =
                Math.abs(dx) > 0.001 &&
                Math.abs(dy) > 0.001;

              const targetGap =
                isDiagonal ? TARGET_GAP : 0;

              const shaftEndX =
                targetBoundary.x -
                ux *
                  (ARROW_HEAD_LENGTH + targetGap);

              const shaftEndY =
                targetBoundary.y -
                uy *
                  (ARROW_HEAD_LENGTH + targetGap);

              const x1 =
                sourceDot.x;

              const y1 =
                sourceDot.y;

              const x2 =
                shaftEndX;

              const y2 =
                shaftEndY;

              return (
                <motion.path
                  key={
                    `e-${n.key}-${to.key}`
                  }

                  initial={
                    false
                  }

                  animate={{
                    d:
                      getPath(
                        x1,
                        y1,
                        x2,
                        y2
                      ),
                  }}

                  transition={{
                    duration:
                      tweenDuration,
                  }}

                  fill="none"

                  markerEnd={
                    'url(#arrow-dark)'
                  }

                  className={
                    styles.edge
                  }

                  style={{
                    strokeLinecap:
                      'butt',
                  }}

                  vectorEffect={
                    'non-scaling-stroke'
                  }
                />
              );
            })}

            {list.map(n => {
              if (
                !n.referenceKey ||
                n.hidden
              ) {
                return null;
              }

              // Hide redundant skeleton arrows to nodes already
              // connected from another data node.
              if (isBupLabelLayout) {
                  const hasIncomingDataArrow = list.some(other =>
                      !other.hidden &&
                      !other.isReference &&
                      other.nextKey === n.referenceKey
                  );

                  if (hasIncomingDataArrow) {
                      return null;
                  }
              }

              const to =
                nodes.get(
                  n.referenceKey
                );

              if (
                !to ||
                to.hidden
              ) {
                return null;
              }

                // Do not draw skeleton reference arrows to nodes
              // that have been moved below the normal data row.
              const dataNodes = list.filter(node =>
                  !node.hidden && !node.isReference
              );

              const topDataY = Math.min(
                  ...dataNodes.map(node => node.pos.y)
              );

              if (
                  n.isReference &&
                  to.pos.y > topDataY
              ) {
                  return null;
              }

              const sourceDot =
                getValueCenter(n);

              const targetRect =
                getValueRect(to);

              const x1 =
                sourceDot.x;

              const y1 =
                sourceDot.y;

              const targetX =
                getValueCenter(to).x;

              const targetY =
                targetRect.top;

              const dx =
                targetX - x1;

              const dy =
                targetY - y1;

              const length =
                Math.sqrt(
                  dx * dx +
                  dy * dy
                );

              const ux =
                length
                  ? dx / length
                  : 0;

              const uy =
                length
                  ? dy / length
                  : 0;

              const x2 =
                targetX -
                ux *
                  ARROW_HEAD_LENGTH;

              const y2 =
                targetY -
                uy *
                  ARROW_HEAD_LENGTH;

              return (
                <motion.path
                  key={
                    `r-${n.key}-${to.key}`
                  }

                  initial={
                    false
                  }

                  animate={{
                    d:
                      getPath(
                        x1,
                        y1,
                        x2,
                        y2
                      ),
                  }}

                  transition={{
                    duration:
                      tweenDuration,
                  }}

                  fill="none"

                  markerEnd={
                    'url(#arrow-dark)'
                  }

                  className={
                    styles.edge
                  }

                  style={{
                    strokeLinecap:
                      'butt',
                  }}

                  vectorEffect={
                    'non-scaling-stroke'
                  }
                />
              );
            })}
          </svg>

          {/* ========================= */}
          {/* NODE LAYER                */}
          {/* ========================= */}

          <AnimateSharedLayout>
            {list.map(n => (
              !n.hidden && (
                <motion.div
                  key={n.key}
                  layout
                  className={[
                    styles.node,
                    variantClass(n),
                    n.hidden && styles.hidden,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    position: 'absolute',
                    left: n.pos.x - 60 + contentOffsetX,
                    top: n.pos.y - 10,
                    width: NODE_W,
                    height: NODE_H,
                  }}
                  transition={{
                    duration: tweenDuration,
                  }}
                >
                  <div className={styles.pill} >
                    <span className={styles.value}>
                    {n.isReference
                        ? <i className={styles.dot} style={{ position: 'static' }} />
                        : n.value}
                    </span>

                    <span className={styles.cap} >
                      <i className={styles.dot} />
                    </span>
                  </div>

                  {n.isReference &&
                      n.variables.includes('LL') && (
                          <div
                              className={styles.varBadge}
                              style={{
                                  position: 'absolute',
                                  // left: '-40px',
                                  // top: '0px',
                                  right: 'calc(100% + var(--ll-label-gap))',
                                  left: 'auto',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                              }}
                          >
                              LL
                          </div>
                      )
                  }

                  <div
                    className={styles.vars}
                                  >
                                    {n.variables
                      .filter(v => !(n.isReference && v === 'LL'))
                      .map(v => (
                      <motion.div
                        layoutId={`${n.key}-${v}`}
                        key={v}

                        // Adjust M/L/R/E label position based on the node row.
                        className={[
                          styles.varBadge,
                          n.isReference && styles.varRefBadge,
                          !n.isReference &&
                          v.split('|').some(tag =>
                            ['M', 'L', 'R', 'E', 'Mid', 'T', 'LR'].includes(tag.trim())
                          )&&
                            n.pos.y === topRowY &&
                            styles.varTopBadge,

                          !n.isReference &&
                          v.split('|').some(tag =>
                            ['M', 'L', 'R', 'E', 'Mid', 'T', 'LR'].includes(tag.trim())
                          )&&
                            n.pos.y === bottomRowY &&
                            topRowY !== bottomRowY &&
                            // ( isBupLabelLayout ? styles.varBottomBadgeBup : styles.varBottomBadge ),
                            styles.varBottomBadge,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
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

      </div>
    );
  }
}

export default LinkedListRenderer;