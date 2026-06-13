// Play tree implementation
// (XXX should add deletion?)
// Needs extra augmentation to make it into an AIA controller for
// animation (best merge AVL tree controller with this code as we want
// animations to be similar)

// The code is contributed by Nidhi goel to Geeks for Geeks
// Modified by Lee Naish

// Javascript code addition 

class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class SplayTree {
  static newNode(key) {
    const node = new Node(key);
    return node;
  }

  static rightRotate(x) {
    const y = x.left;
    x.left = y.right;
    y.right = x;
    return y;
  }

  static leftRotate(x) {
    const y = x.right;
    x.right = y.left;
    y.left = x;
    return y;
  }

  // version of splay that may be slightly less efficient but has
  // a simpler structure for AIA
  static splay(root, key) {
    // do nothing cases (could add negation of these to other cases)
    if (root == null
        || root.key == key
        || root.key > key && root.left == null
        || root.key < key && root.right == null) {
      return root;
    }
    // left only cases (could combine)
    if (root.key > key && root.left.key > key && root.left.left == null) {
      return SplayTree.rightRotate(root);
    }
    if (root.key > key && root.left.key <= key && root.left.right == null) {
      return SplayTree.rightRotate(root);
    }
    // left left case
    if (root.key > key && root.left.key > key && root.left.left !== null) {
      root.left.left = SplayTree.splay(root.left.left, key);
      root = SplayTree.rightRotate(root);
      return SplayTree.rightRotate(root);
    }
    // left right case
    if (root.key > key && root.left.key <= key && root.left.right !== null) {
      root.left.right = SplayTree.splay(root.left.right, key);
      root.left = SplayTree.leftRotate(root.left);
      return SplayTree.rightRotate(root);
    }
    // right only cases (could combine)
    if (root.key < key && root.right.key > key && root.right.left == null) {
      return SplayTree.leftRotate(root);
    }
    if (root.key < key && root.right.key <= key && root.right.right == null) {
      return SplayTree.leftRotate(root);
    }
    // right right case
    if (root.key < key && root.right.key <= key && root.right.right !== null) {
      root.right.right = SplayTree.splay(root.right.right, key);
      root = SplayTree.leftRotate(root);
      return SplayTree.leftRotate(root);
    }
    // right left case
    if (root.key < key && root.right.key > key && root.right.left !== null) {
      root.right.left = SplayTree.splay(root.right.left, key);
      root.right = SplayTree.rightRotate(root.right);
      return SplayTree.leftRotate(root);
    }
/*
    if (root.key > key) {
      if (root.left.key > key) {
        root.left.left = SplayTree.splay(root.left.left, key);
        root = SplayTree.rightRotate(root);
        return root.left == null ? root : SplayTree.rightRotate(root);
      } else if (root.left.key <= key) {
        root.left.right = SplayTree.splay(root.left.right, key);
        if (root.left.right != null) {
          root.left = SplayTree.leftRotate(root.left);
        }
        return root.left == null ? root : SplayTree.rightRotate(root);
      }
    } else {
      if (root.right.key > key) {
        root.right.left = SplayTree.splay(root.right.left, key);
        if (root.right.left != null) {
          root.right = SplayTree.rightRotate(root.right);
        }
      } else if (root.right.key < key) {
        root.right.right = SplayTree.splay(root.right.right, key);
        root = SplayTree.leftRotate(root);
      }
      return root.right == null ? root : SplayTree.leftRotate(root);
    }
*/
  }

/*
  static splay(root, key) {
    if (root == null || root.key == key) {
      return root;
    }

    if (root.key > key) {
      if (root.left == null) {
        return root;
      }

      if (root.left.key > key) {
        root.left.left = SplayTree.splay(root.left.left, key);
        root = SplayTree.rightRotate(root);
      } else if (root.left.key < key) {
        root.left.right = SplayTree.splay(root.left.right, key);
        if (root.left.right != null) {
          root.left = SplayTree.leftRotate(root.left);
        }
      }
      return root.left == null ? root : SplayTree.rightRotate(root);
    } else {
      if (root.right == null) {
        return root;
      }

      if (root.right.key > key) {
        root.right.left = SplayTree.splay(root.right.left, key);
        if (root.right.left != null) {
          root.right = SplayTree.rightRotate(root.right);
        }
      } else if (root.right.key < key) {
        root.right.right = SplayTree.splay(root.right.right, key);
        root = SplayTree.leftRotate(root);
      }
      return root.right == null ? root : SplayTree.leftRotate(root);
    }
  }
*/

  static search(root, key) {
    root = SplayTree.splay(root, key);
    return root;
  }

  static insert(root, key) {
    if (root == null) {
      return SplayTree.newNode(key);
    }

    root = SplayTree.splay(root, key);

    if (root.key == key) {
      return root;
    }

    const node = SplayTree.newNode(key);
    if (root.key > key) {
      node.right = root;
      node.left = root.left;
      root.left = null;
    } else {
      node.left = root;
      node.right = root.right;
      root.right = null;
    }
    return node;
  }

  static preOrder(node) {
    if (node != null) {
      console.log(+ node.key + " ");
      SplayTree.preOrder(node.left);
      SplayTree.preOrder(node.right);
    }
  }

  static preOrderStr(node) {
    if (node != null) {
      return "(" + node.key + " " +
        SplayTree.preOrderStr(node.left) +
        SplayTree.preOrderStr(node.right) +
        ")";
    } else
        return "";
  }

  static inOrderStr(node) {
    if (node != null) {
      return "(" + 
        SplayTree.inOrderStr(node.left) +
        node.key +
        SplayTree.inOrderStr(node.right) +
        ")";
    } else
        return "";
  }
}

let skey = 100; // search key
let res;        //search result
let root = null;
console.log("Inorder traversals of the Splay tree:");
root = SplayTree.insert(root, 90);
root = SplayTree.insert(root, 80);
root = SplayTree.insert(root, 88);
root = SplayTree.insert(root, 67);
root = SplayTree.insert(root, 44);
root = SplayTree.insert(root, 98);
root = SplayTree.insert(root, 33);
root = SplayTree.insert(root, 45);
console.log(SplayTree.inOrderStr(root));
root = SplayTree.insert(root, 50);
console.log(SplayTree.inOrderStr(root));
root = SplayTree.insert(root, 200);
console.log(SplayTree.inOrderStr(root));
skey = 100;
root = SplayTree.search(root, skey);
console.log(skey + (root.key == skey? ":)": ":("));
console.log(SplayTree.inOrderStr(root));
root = SplayTree.insert(root, 40);
console.log(SplayTree.inOrderStr(root));
root = SplayTree.insert(root, 30);
console.log(SplayTree.inOrderStr(root));
skey = 45;
root = SplayTree.search(root, skey);
console.log(skey + (root.key == skey? ":)": ":("));
console.log(SplayTree.inOrderStr(root));
root = SplayTree.insert(root, 40);
console.log(SplayTree.inOrderStr(root));
skey = 250;
root = SplayTree.search(root, skey);
console.log(skey + (root.key == skey? ":)": ":("));
console.log(SplayTree.inOrderStr(root));

