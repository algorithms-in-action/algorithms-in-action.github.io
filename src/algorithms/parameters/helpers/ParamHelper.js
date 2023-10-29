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
  const regex = /^[a-z\s]+$/g;
  return t.match(regex);
};

export const singleNumberValidCheck = (t) => {
  const regex = /^\d+$/g;
  return t.match(regex);
};

// eslint-disable-next-line consistent-return
export const matrixValidCheck = (m) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < m.length; i++) {
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < i; j++) {
      if (m[i][j] !== m[j][i]) {
        return false;
      }
    }
    if (m[i][i] !== 0) {
      return false;
    }
  }
  return true;
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

export const quicksortPerfectPivotArray = (minA, maxA) => {
  function idealOrder(min, max, v, step) {
    if (max <= min) {
      return [];
    }
    const midDivider = Math.floor(((max - min) / 2) + min);
    const left = idealOrder(min, midDivider - step, v, step);
    const right = idealOrder(midDivider + step, max, -1, step);

    if (v === 1) {
      return left.concat(right).concat([midDivider]);
    }
    return [midDivider].concat(left).concat(right);
  }
  return idealOrder(minA, maxA, 1, 2);
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
    logMsg={`${example || ''}`}
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
 * Return XY columns for new params user interface
 * @return array of object
 */

export const makeColumnCoords = () => {
  const arr = [];
  arr.push({Header: 'X', accessor: `col${0}`,});
  arr.push({Header: 'Y', accessor: `col${1}`,});

  return arr;
};

/**
 * Creates nicely spaced graph coordinate data.
 * @param {number} len size of the matrix
 * @param minDiff min diff from max coord val
 * @param maxDiff max diff from max coord val
 * @return array of object
 */
export const makeRandomCoordinateData = (len, minDiff, maxDiff) => {
  let xMax = 0;
  let yMax = 0; 
  const coords = [];
  for (let i = 0; i < len; i += 1) {
    const coord = [];
    // If even, x coordinate should at least be xMax.
      if(i % 2 == 0){
        const x = getRandomInt(xMax + minDiff, xMax + maxDiff); 
        const y = getRandomInt(1, yMax);
        coord.push(x);
        coord.push(y);
        if(x > xMax){
          xMax = x;
        }
      }
      else
      {
        // In current implementation we want y diffs to be less due to y axis cutoff.
        const x = getRandomInt(1, xMax); 
        const y = getRandomInt(yMax + minDiff, yMax + maxDiff);
        coord.push(x);
        coord.push(y);
        if(y > yMax){
          yMax = y;
        }
      }
      coords.push(coord);
    }

    let arr = [];
    for (let i = 0; i < len; i += 1) {
      const data = {};
      for (let j = 0; j < len; j += 1) {
        if(j < 2)
        {
          data[`col${j}`] = `${coords[i][j]}`;
        }
        else
        {
          data[`col${j}`] = '0';
        }
      }
      arr.push(data);
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
        let val = 0; 
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
      if (i === j && !symmetric) {
        data[`col${j}`] = '1';
      }
    }
    arr.push(data);
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
