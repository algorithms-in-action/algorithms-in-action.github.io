import avlInsertion from './AVLTreeInsertion';
import bstInsertion from './binaryTreeInsertion';
import recursiveInsertion from './BSTrecInsertion';
import iterativeSearch from './AVLTreeSearch';
import recursiveSearch from './BSTrecSearch';

function combine(insert, search) {
  const result = { Main: [] };
  [['insert', insert], ['search', search]].forEach(([operation, blocks]) => {
    Object.entries(blocks).forEach(([name, lines]) => {
      const mapped = lines.map(line => ({
        ...line,
        ...(line.bookmark !== undefined ? { bookmark: `${operation}_${line.bookmark}` } : {}),
        ...(line.ref ? { ref: `${operation}_${line.ref}` } : {}),
      }));
      if (name === 'Main') {
        if (result.Main.length) result.Main.push({ code: '\n', indentation: 0, explanation: '' });
        result.Main.push(...mapped);
      } else {
        result[`${operation}_${name}`] = mapped;
      }
    });
  });
  return result;
}

export const AVLTreeOperations = combine(avlInsertion, iterativeSearch);
export const BSTOperations = combine(bstInsertion, iterativeSearch);
export const BSTrecOperations = combine(recursiveInsertion, recursiveSearch);
