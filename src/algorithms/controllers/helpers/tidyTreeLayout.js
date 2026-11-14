const getContours = (positions) => {
  const left = [];
  const right = [];

  positions.forEach(({ x, depth }) => {
    left[depth] = left[depth] === undefined ? x : Math.min(left[depth], x);
    right[depth] = right[depth] === undefined ? x : Math.max(right[depth], x);
  });

  return { left, right };
};

const shiftLayout = (layout, xOffset) => {
  const shifted = new Map();
  layout.positions.forEach((position, id) => {
    shifted.set(id, {
      x: position.x + xOffset,
      depth: position.depth + 1,
    });
  });
  return shifted;
};

/**
 * Calculates stable coordinates for any binary-tree representation.
 * Tree-specific behaviour is supplied through the adapter functions.
 */
export const createTidyTreeLayout = ({
  root,
  getId = node => node.id,
  getLeft = node => node.left,
  getRight = node => node.right,
  nodeGap = 90,
  singleChildOffset = 70,
  levelGap = 120,
  rootX = 0,
  rootY = 0,
}) => {
  if (root === null || root === undefined) return new Map();

  const layoutSubtree = (node) => {
    const id = getId(node);
    const leftNode = getLeft(node);
    const rightNode = getRight(node);
    const leftLayout = leftNode === null || leftNode === undefined
      ? null
      : layoutSubtree(leftNode);
    const rightLayout = rightNode === null || rightNode === undefined
      ? null
      : layoutSubtree(rightNode);
    const positions = new Map([[id, { x: 0, depth: 0 }]]);

    if (leftLayout && rightLayout) {
      let childOffset = singleChildOffset;
      const sharedDepth = Math.min(
        leftLayout.contours.right.length,
        rightLayout.contours.left.length,
      );

      for (let depth = 0; depth < sharedDepth; depth++) {
        const requiredOffset = (
          leftLayout.contours.right[depth]
          - rightLayout.contours.left[depth]
          + nodeGap
        ) / 2;
        childOffset = Math.max(childOffset, requiredOffset);
      }

      shiftLayout(leftLayout, -childOffset).forEach((position, childId) => {
        positions.set(childId, position);
      });
      shiftLayout(rightLayout, childOffset).forEach((position, childId) => {
        positions.set(childId, position);
      });
    } else if (leftLayout) {
      shiftLayout(leftLayout, -singleChildOffset).forEach((position, childId) => {
        positions.set(childId, position);
      });
    } else if (rightLayout) {
      shiftLayout(rightLayout, singleChildOffset).forEach((position, childId) => {
        positions.set(childId, position);
      });
    }

    return { positions, contours: getContours(positions) };
  };

  const layout = layoutSubtree(root);
  const coordinates = new Map();
  layout.positions.forEach((position, id) => {
    coordinates.set(id, {
      x: rootX + position.x,
      y: rootY + position.depth * levelGap,
    });
  });
  return coordinates;
};

export default createTidyTreeLayout;
