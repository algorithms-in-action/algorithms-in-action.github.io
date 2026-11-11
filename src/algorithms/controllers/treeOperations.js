import avlInsertion from './AVLTreeInsertion';
import bstInsertion from './binaryTreeInsertion';
import recursiveInsertion from './BSTrecInsertion';
import iterativeSearch from './AVLTreeSearch';
import { insertOrSearch } from './InsertionSharedCode';
import { fromFlatTree, toFlatTree, getTreePath } from './helpers/treeUtils';
import { clearTreeHighlights } from './helpers/treeOperationHelpers';
import { resetTreeAnimationState } from './helpers/treeAnimationState';

function operationChunker(chunker, type) {
  return {
    add(bookmark, ...args) {
      const mapped = typeof bookmark === 'object'
        ? { ...bookmark, bookmark: `${type}_${bookmark.bookmark}` }
        : `${type}_${bookmark}`;
      chunker.add(mapped, ...args);
    },
  };
}

function createTreeOperationsController({ avl = false, recursive = false } = {}) {
  const insertion = avl ? avlInsertion : recursive ? recursiveInsertion : bstInsertion;
  return {
    initVisualisers: () => insertion.initVisualisers({ visualiser: {} }),
    run(chunker, { operations = [], nodes = [] }) {
      const sequence = operations.length ? operations : nodes.map(value => ({ type: 'insert', value }));
      let root = null;
      sequence.forEach(({ type, value }, index) => {
        if (!['insert', 'search'].includes(type) || !Number.isSafeInteger(value)) {
          throw new Error('Invalid tree operation');
        }
        const entry = type === 'insert' ? (recursive || avl ? 'Main' : '1')
          : recursive ? 'Main' : 'AVL_Search(t, k)';
        const current = operationChunker(chunker, type);
        current.add(entry, (vis, operation, key) => {
          const graph = vis.graph;
          clearTreeHighlights(graph);
          graph.nodes.forEach(node => graph.updateUpperLabel(node.id, ''));
          graph.popAllRectStack();
          graph.setPauseLayout(false);
          graph.setMoveRatio(1);
          graph.setSize(1.2);
          graph.setZoom(0.5);
          graph.isWeighted = avl;
          graph.setText('');
          graph.setFunctionName(`${operation === 'insert' ? 'Insert' : 'Search'}: ${key}`);
          graph.setFunctionInsertText();
          graph.setFunctionNode(null);
          graph.setFunctionBalance(null);
          resetTreeAnimationState(graph);
        }, [type, value]);

        const path = getTreePath(root, value);
        const found = path.length > 0 && path[path.length - 1] === value;
        if (type === 'insert') {
          if (recursive || avl) {
            root = insertOrSearch(current, root, value, index, { avl, mode: 'operations' });
          } else {
            const tree = bstInsertion.run(current, {
              nodes: [value], tree: toFlatTree(root), root: root ? root.key : null,
            });
            root = fromFlatTree(root ? root.key : value, tree);
          }
        } else if (recursive) {
          insertOrSearch(current, root, value, index, { operation: 'search', mode: 'operations' });
        } else {
          iterativeSearch.run(current, {
            target: value, tree: toFlatTree(root), root: root ? root.key : null,
          });
        }

        const end = type === 'insert' ? (recursive || avl ? 'Done' : 'end')
          : recursive ? 'Done' : found ? 'return t' : 'return NotFound';
        current.add(end, (vis, rootKey, operation, key, existed) => {
          const graph = vis.graph;
          graph.popAllRectStack();
          graph.setPauseLayout(false);
          graph.setMoveRatio(1);
          graph.root = rootKey;
          if (rootKey !== null) {
            if (recursive || avl) graph.layoutAVL(rootKey, true, false);
            else graph.layoutBST(rootKey, true);
          }
          graph.setFunctionNode(null);
          graph.setFunctionBalance(null);
          graph.setFunctionInsertText();
          graph.setFunctionName(operation === 'search'
            ? `${existed ? 'Found' : 'Not found'}: ${key}`
            : `${existed ? 'Already exists' : 'Inserted'}: ${key}`);
        }, [root ? root.key : null, type, value, found]);
      });
      return root;
    },
  };
}

export const AVLTreeOperations = createTreeOperationsController({ avl: true });
export const BSTOperations = createTreeOperationsController();
export const BSTrecOperations = createTreeOperationsController({ recursive: true });
