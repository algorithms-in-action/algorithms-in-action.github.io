/**
 * Calculates stable coordinates for a tree with any number of ordered
 * children (e.g. a base 4 or base 10 trie). Children are packed left to
 * right as close as their subtrees allow, and each parent is centred over
 * its first and last child; a single child sits directly below its parent.
 */
export const createMultiwayTreeLayout = ({
  root,
  getId = node => node.id,
  getChildren = node => node.children,
  nodeGap = 90,
  levelGap = 120,
  rootX = 0,
  rootY = 0,
}) => {
  if (root === null || root === undefined) return new Map();

  // Returns positions relative to node at x = 0, plus the left/right
  // extent of the subtree at each depth.
  const layoutSubtree = (node) => {
    const children = getChildren(node).map(layoutSubtree);
    const left = [];
    const right = [];
    const offsets = children.map((child) => {
      let offset = 0;
      child.left.forEach((x, depth) => {
        if (right[depth] !== undefined) {
          offset = Math.max(offset, right[depth] - x + nodeGap);
        }
      });
      child.left.forEach((x, depth) => {
        left[depth] = left[depth] === undefined ? x + offset : left[depth];
        right[depth] = child.right[depth] + offset;
      });
      return offset;
    });
    const centre = children.length ? (offsets[0] + offsets[offsets.length - 1]) / 2 : 0;
    const positions = new Map([[getId(node), { x: 0, depth: 0 }]]);
    children.forEach((child, index) => {
      child.positions.forEach(({ x, depth }, id) => {
        positions.set(id, { x: x + offsets[index] - centre, depth: depth + 1 });
      });
    });
    return {
      positions,
      left: [0, ...left.map(x => x - centre)],
      right: [0, ...right.map(x => x - centre)],
    };
  };

  const coordinates = new Map();
  layoutSubtree(root).positions.forEach(({ x, depth }, id) => {
    coordinates.set(id, { x: rootX + x, y: rootY + depth * levelGap });
  });
  return coordinates;
};

export default createMultiwayTreeLayout;
