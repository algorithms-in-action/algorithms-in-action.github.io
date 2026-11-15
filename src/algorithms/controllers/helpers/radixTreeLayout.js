// Stable coordinates for an R-way tree such as a trie. Child d sits
// (d - (R - 1) / 2) * slotGap from its parent unless subtrees need more
// room, so for R = 2 this matches createTidyTreeLayout with
// singleChildOffset = slotGap / 2.

const contoursOf = (positions) => {
  const left = [];
  const right = [];
  positions.forEach(({ x, depth }) => {
    left[depth] = left[depth] === undefined ? x : Math.min(left[depth], x);
    right[depth] = right[depth] === undefined ? x : Math.max(right[depth], x);
  });
  return { left, right };
};

export const createRadixTreeLayout = ({
  root,
  radix,
  getId = node => node.id,
  getChild = (node, digit) => node.children[digit],
  nodeGap = 100,
  slotGap = 110,
  levelGap = 100,
  rootX = 0,
  rootY = 0,
}) => {
  if (root === null || root === undefined) return new Map();
  const slotOffset = digit => (digit - (radix - 1) / 2) * slotGap;

  const layoutSubtree = (node) => {
    const children = [];
    for (let digit = 0; digit < radix; digit += 1) {
      const child = getChild(node, digit);
      if (child !== null && child !== undefined) {
        children.push({ digit, ...layoutSubtree(child) });
      }
    }
    // Pack children left to right, then centre the parent over their slots.
    let placedRight = [];
    children.forEach((child, index) => {
      if (index === 0) {
        child.x = 0;
      } else {
        const previous = children[index - 1];
        child.x = previous.x + (child.digit - previous.digit) * slotGap;
        const sharedDepth = Math.min(placedRight.length, child.contours.left.length);
        for (let depth = 0; depth < sharedDepth; depth += 1) {
          child.x = Math.max(child.x, placedRight[depth] - child.contours.left[depth] + nodeGap);
        }
      }
      placedRight = child.contours.right.map((x, depth) => (
        depth < placedRight.length ? Math.max(placedRight[depth], x + child.x) : x + child.x));
    });
    const centre = children.length
      ? children.reduce((sum, child) => sum + child.x - slotOffset(child.digit), 0) / children.length
      : 0;
    const positions = new Map([[getId(node), { x: 0, depth: 0 }]]);
    children.forEach(child => child.positions.forEach((position, id) => {
      positions.set(id, { x: position.x + child.x - centre, depth: position.depth + 1 });
    }));
    return { positions, contours: contoursOf(positions) };
  };

  const coordinates = new Map();
  layoutSubtree(root).positions.forEach((position, id) => {
    coordinates.set(id, { x: rootX + position.x, y: rootY + position.depth * levelGap });
  });
  return coordinates;
};

export default createRadixTreeLayout;
