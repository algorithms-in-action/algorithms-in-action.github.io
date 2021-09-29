/* eslint-disable no-param-reassign */
import React from 'react';
import Denque from 'denque';
import ParamMsg from './ParamMsg';

export const commaSeparatedNumberListValidCheck = (t) => {
  const regex = /^[0-9]+(,[0-9]+)*$/g;
  return t.match(regex);
};

export const stringListValidCheck = (t) => {
  const regex = /^[a-zA-Z]+(,[a-zA-Z]+)*$/g;
  return t.match(regex);
};

export const stringValidCheck = (t) => {
  const regex = /^[a-zA-Z]+$/g;
  return t.match(regex);
};

export const singleNumberValidCheck = (t) => {
  const regex = /^\d+$/g;
  return t.match(regex);
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const genRandNumList = (num, min, max) => {
  const list = [];
  for (let x = 0; x < num; x += 1) {
    list.push(getRandomInt(min, max));
  }
  return list;
};

export const successParamMsg = (type) => (
  <ParamMsg
    logWarning={false}
    logTag=""
    logMsg=""
  />
);

/**
 *
 * @param {string} type algorithm type
 * @param {string} example optional provided
 * @param {string} reason optional provided, if not provide, use default value
 */
export const errorParamMsg = (
  type,
  example,
  reason = `It seems the ${type} algorithm does not accept this data.`,
) => (
  <ParamMsg
    logWarning
    logTag="Oops..."
    logMsg={`${reason} ${example || ''}`}
  />
);

/**
 * Populate the Column array, see React-Table API
 * https://react-table.tanstack.com/docs/quick-start
 * @param {number} len size of the matrix
 * @return array of object
 */
export const makeColumnArray = (len) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push({
      Header: i + 1,
      accessor: `col${i}`, // accessor is the "key" in the data,
    });
  }
  return arr;
};

/**
 * Populate the data cells, see React-Table API
 * https://react-table.tanstack.com/docs/quick-start
 * @param {number} len size of the matrix
 * @param min
 * @param max
 * @param symmetric
 * @return array of object
 */
export const makeData = (len, min, max, symmetric) => {
  const rows = [];
  if (symmetric) {
    for (let i = 0; i < len; i += 1) {
      const row = [];
      for (let j = 0; j < len; j += 1) {
        let val = 0; // i === j
        if (j < i) {
          val = rows[j][i];
        } else if (i !== j) {
          val = getRandomInt(min, max);
        }
        row.push(val);
      }
      rows.push(row);
    }
  }
  // const arr = [];
  let arr = [];
  for (let i = 0; i < len; i += 1) {
    const data = {};
    for (let j = 0; j < len; j += 1) {
      data[`col${j}`] = symmetric
        ? `${rows[i][j]}`
        : `${getRandomInt(min, max)}`;
    }
    arr.push(data);
  }
  if (len === 4) {
    arr = [
      {
        col0: '0',
        col1: '0',
        col2: '0',
        col3: '1',
      },
      {
        col0: '1',
        col1: '0',
        col2: '0',
        col3: '1',
      },
      {
        col0: '1',
        col1: '1',
        col2: '0',
        col3: '0',
      },
      {
        col0: '0',
        col1: '0',
        col2: '1',
        col3: '0',
      },
    ];
  }
  return arr;
};

export const balanceBSTArray = (nodes) => {
  class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  const insertNode = (array) => {
    if (array.length === 0) {
      return null;
    }
    const midpoint = Math.floor(array.length / 2);
    const root = new TreeNode(array[midpoint]);
    root.left = insertNode(array.slice(0, midpoint));
    root.right = insertNode(array.slice(midpoint + 1));
    return root;
  };

  const buildBalancedBST = (array) => {
    const root = insertNode(array);
    return root;
  };

  const levelOrderTraversal = (root) => {
    const output = [];
    const queue = new Denque();
    queue.push(root);
    while (!queue.isEmpty()) {
      const element = queue.shift();
      if (element !== null) {
        output.push(element.value);
        queue.push(element.left);
        queue.push(element.right);
      }
    }
    return output;
  };
  const BST = buildBalancedBST(nodes);
  const balancedBST = levelOrderTraversal(BST);
  return balancedBST;
};

export const shuffleArray = (array) => {
  // eslint-disable-next-line no-plusplus
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
