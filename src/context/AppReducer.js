const reducer = (state, action) => {
  switch (action.type) {
    case 'BST': return { name: 'Binary Search Trees', text: 'In computer science, binary search trees (BST), sometimes called ordered or sorted binary trees, are a particular type of container: a data structure that stores "items" (such as numbers, names etc.) in memory. They allow fast lookup, addition and removal of items, and can be used to implement either dynamic sets of items, or lookup tables that allow finding an item by its key (e.g., finding the phone number of a person by name). Binary search trees keep their keys in sorted order, so that lookup and other operations can use the principle of binary search: when looking for a key in a tree (or a place to insert a new key), they traverse the tree from root to leaf, making comparisons to keys stored in the nodes of the tree and deciding, on the basis of the comparison, to continue searching in the left or right subtrees. On average, this means that each comparison allows the operations to skip about half of the tree, so that each lookup, insertion or deletion takes time proportional to the logarithm of the number of items stored in the tree. This is much better than the linear time required to find items by key in an (unsorted) array, but slower than the corresponding operations on hash tables. Several variants of the binary search tree have been studied in computer science; this article deals primarily with the basic type, making references to more advanced types when appropriate.' };
    case 'QS': return { name: 'Quick Sort', text: 'Quick Sort' };
    case 'KMP': return { name: 'KMP', text: 'KMP' };
    case 'HS': return { name: 'HS', text: 'Heap Sort' };
    case 'TS': return { name: 'TS', text: 'Transitive closure' };
    default: return state;
  }
};

export default reducer;
