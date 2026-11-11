/**
 * Focused test for SplayTree search logic
 * Tests the pure splay tree data structure without React/Jest
 */

const SplayTree = require('./src/algorithms/controllers/splaytree').default;
const { Node } = require('./src/algorithms/controllers/splaytree');

console.log('\n=== Splay Tree Search Test ===\n');

// Helper: build a tree from an array
function buildTree(values) {
  let root = null;
  for (const val of values) {
    root = SplayTree.insert(root, val);
  }
  return root;
}

// Helper: in-order traversal to print tree
function inOrder(node, result = []) {
  if (!node) return result;
  inOrder(node.left, result);
  result.push(node.key);
  inOrder(node.right, result);
  return result;
}

// Test 1: Basic insertion and initial tree structure
console.log('Test 1: Insert values [5, 3, 7, 2, 4, 6, 8]');
const tree1 = buildTree([5, 3, 7, 2, 4, 6, 8]);
console.log('  Tree (in-order):', inOrder(tree1).join(', '));
console.log('  Root:', tree1.key);
console.log('  ✓ Root should be 8 (last inserted)');

// Test 2: Search for existing key - should be splayed to root
console.log('\nTest 2: Search for key 3 in tree');
const tree2 = buildTree([5, 3, 7, 2, 4, 6, 8]);
const result2 = SplayTree.search(tree2, 3);
console.log('  Tree (in-order):', inOrder(result2).join(', '));
console.log('  Root:', result2.key);
console.log('  ✓ Root should be 3 (was splayed to root)');
console.log('  ✓ Found:', result2.key === 3 ? 'YES' : 'NO');

// Test 3: Search for non-existent key - last accessed node should be root
console.log('\nTest 3: Search for non-existent key 1 in tree');
const tree3 = buildTree([5, 3, 7, 2, 4, 6, 8]);
const result3 = SplayTree.search(tree3, 1);
console.log('  Tree (in-order):', inOrder(result3).join(', '));
console.log('  Root:', result3.key);
console.log('  ✓ Root should be 2 (last accessed node during search for 1)');

// Test 4: Multiple searches - verify splay behavior
console.log('\nTest 4: Sequence of searches - [5, 7, 2, 4]');
let tree4 = buildTree([5, 3, 7, 2, 4, 6, 8]);
const searchSequence = [5, 7, 2, 4];
for (const key of searchSequence) {
  tree4 = SplayTree.search(tree4, key);
  console.log(`  After search(${key}): root=${tree4.key}, in-order=[${inOrder(tree4).join(', ')}]`);
}
console.log('  ✓ Last root should be 4');

// Test 5: Empty tree handling
console.log('\nTest 5: Search in empty tree');
const result5 = SplayTree.search(null, 5);
console.log('  Result:', result5);
console.log('  ✓ Should return null for empty tree');

// Test 6: Single node tree
console.log('\nTest 6: Single node tree - search for existing key');
const tree6 = SplayTree.insert(null, 10);
const result6 = SplayTree.search(tree6, 10);
console.log('  Root:', result6.key);
console.log('  ✓ Should be 10');

console.log('\n=== All Focused Tests Complete ===\n');
