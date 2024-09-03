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

/**
 * Generate a list of unique random numbers given size.
 * @param {*} num the length of the list to generate.
 * @param {*} min the minimum value of the random number.
 * @param {*} max the maximum value of the random number.
 * @returns the generated list.
 */
export const genUniqueRandNumList = (num, min, max) => {

  const set = new Set();
  while (set.size < num) {
    set.add(getRandomInt(min, max));
  }
  return Array.from(set);
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


// XXX OLD version - could probably delete now
/**
 * Populate the data cells, see React-Table API
 * https://react-table.tanstack.com/docs/quick-start
 * @param {number} len size of the matrix
 * @param min
 * @param max
 * @param symmetric
 * @return array of object
 */
// Create random-ish edge matrix
// Was called with min=max=1 so we get a complete graph every time -
// visually confusing! Best arrange things so we have a small number of
// edges per node (2-3 seems reasonable), so we could use size + random
// number to determine if there is an edge and min&max (or 1) to get edge
// length if there is one. To make sure we have a connected graph we could
// force node n to be connected to node n+1
export const makeWeightsOld = (len, min, max, symmetric, unweighted) => {
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
          if (unweighted) {
            val = val > 0 ? 1 : 0;  // If unweighted, force the value to be either 0 or 1.
          }
        }
        row.push(val);
      }
      rows.push(row);
    }
  }
  let arr = [];
  for (let i = 0; i < len; i += 1) {
    const data = {};
    for (let j = 0; j < len; j += 1) {
      let value = symmetric
        ? `${rows[i][j]}`
        : `${getRandomInt(min, max)}`;
      if (unweighted) {
        value = parseInt(value, 10) > 0 ? '1' : '0'; // If unweighted, force the value to be either 0 or 1.
      }
      if (i === j && !symmetric) {
        value = '1';
      }
      data[`col${j}`] = value;
    }
    arr.push(data);
  }
  if (len === 4 && symmetric !== true) { // XXX WTF?
    arr = [
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
        col3: '1',
      },
      {
        col0: '1',
        col1: '1',
        col2: '1',
        col3: '0',
      },
      {
        col0: '0',
        col1: '0',
        col2: '1',
        col3: '1',
      },
    ];
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
// Attempt at better version of random graph. Makes sure a connected
// graph is returned. Attempt to limit degree of nodes (still tends to
// be a bit sparse for a small number of nodes and perhaps a bit dense
// for a large number - could make some adjustments.  Could be nice for
// this to have the X-Y coordinates passed in; currently they are done
// independently, which limits things somewhat.
export const makeWeights = (len, min, max, symmetric, unweighted, circular=false) => {
  const rows = [];

  // get pseudo-random len*len edge matrix
  // Try to get average degree around 3, edges being more likely between
  // nodes with similar numbers; lower degree for circular graphs
  let diffMult = 4; // magic number for random edge generation
  let sub = 6; // magic number for random edge generation
  if (circular) {
    diffMult = 3 ; // larger means fewer edges between close nodes
    sub = 0; // smaller means fewer edges in total
  }
  for (let i = 0; i < len; i += 1) {
    let row = [];
    let edgeCount = 0;
    let tries = 0; // we try several times to get 0<edgeCount<5 then give up
    do {
      tries++;
      row = [];
      edgeCount = 0; // edge count for this node/row
      for (let j = 0; j < len; j += 1) {
        let val = 0;
        if (j < i && symmetric) {
          val = rows[j][i];
        } else if (i == j) {
          // XXX using symmetric flag to determine if leading
          // diagonal is 1 or 0 is a bit sus but thats what earlier
          // code did...
          val = (symmetric? 0 : 1);
          // always have an edge between i and i+1 to make sure graph is
          // connected, unless its circular
        } else if (j == i+1 && !circular) {
          val = (unweighted? 1: getRandomInt(min, max));
          // else determine if we want an edge between i and j
          // - if i&j differ more we reduce likelihood
        } else if (Math.random() < 0.75**(Math.abs(i-j)*diffMult - sub)) {
          val = (unweighted? 1: getRandomInt(min, max));
        }
        if (val > 0) edgeCount++;
        row.push(val);
      }
      // console.log('try ' + tries + 'edgeCount = ' + edgeCount);
    } while (tries < 40 && (edgeCount === 0 && !circular || edgeCount > 4) && len > 1)
    // console.log('row' + i + ': ' + row);
    rows.push(row);
  }
  let arr = [];
  for (let i = 0; i < len; i += 1) {
    const data = {};
    for (let j = 0; j < len; j += 1) {
      data[`col${j}`] = `${rows[i][j]}`;
    }
    arr.push(data);
  }
  return arr;
}


// Create len random-ish XY coordinates in range min to max for
// Euclidean graphs
export const makeXYCoords = (len, min, max, circular=false) => {
  // added circular layout for Warshall's
  if (circular)
    return makeXYCoordsCircular(len, min, max);
  const rows = [];
  let arr = [];
  let prevX = 0;  // keep track of previous 2 X,Y values to reduce close nodes
  let prevY = 0;
  let prevX1 = 0;
  let prevY1 = 0;
  for (let i = 0; i < len; i += 1) {
    const data = {};
    // To make the graph more readable it helps to spread the X values
    // across the range rather than have everything clumped up.
    // We break up the range min to max into columns xmin-xmax for each
    // i value. If sep=0 there is no separation of columns: xmin is
    // min and xmax is max for all i. If sep=1 the columns are separated
    // as much as possible, X_{i} <= X_{i+1} for all i and we get even
    // spread of X values over the whole range. For 0<sep<1 we get more
    // spread than purely random but the xmin-xmax columns overlap.
    // const sep = 0; // no attempt to spread X values
    // const sep = 1; // X values spread pretty evenly
    const sep = 0.9;
    let xmin = Math.floor(min + sep*(max-min)*i/len);
    let xmax = Math.ceil(max - sep*(max-min)*(len-1-i)/len);
    let x = getRandomInt(xmin, xmax);
    data[`col0`] = `${x}`;
    // Ideally, spreading the Y values would also be good but we dont
    // want them correlated with the X values so its not so easy.
    // Also good to avoid nodes that are too close together - you can't
    // see the edge because of the circles depicting the nodes, so we
    // have several tries at avoiding having a node close to the
    // previous two.
    // We use max/3 as the max Y value because the screen space for the
    // graph is wide but not high
    let y = 0;
    let tries = 0;
    do {
      y = getRandomInt(min, max/3);
      tries++;
    } while(tries < 20 && (euclidean(x,y,prevX,prevY) < 5 || euclidean(x,y,prevX1,prevY1) < 5));
    data[`col1`] = `${y}`;
    prevX1 = prevX;
    prevY1 = prevY;
    prevX = x;
    prevY = y;
    arr.push(data);
  }
  return arr;
}

// Create len circular-ish XY coordinates for graph in range min to max for
// Warshall's
export const makeXYCoordsCircular = (len, min, max) => {
  const unitAngle = (2 * Math.PI) / len;
  const radius = (max-min)/6; // height on screen is limited
  const midX = (max-min)/2;
  const midY = 1 + (max-min)/6; // avoid X axis
  let arr = [];
  for (let i = 0; i < len; i += 1) {
    let data = {};
    let x = Math.round(midX + (Math.cos(Math.PI+unitAngle*i) * radius));
    let y = Math.round(midY + (Math.sin(Math.PI+unitAngle*i) * radius));
    data[`col0`] = `${x}`;
    data[`col1`] = `${y}`;
    arr.push(data);
  }
  return arr;
}

// Euclidean distance between two points (rounded up)
// We round up so we can have the choice of admissible and inadmissible
// heuristics in A* more easily (and avoid floating point)
export const euclidean = (x1, y1, x2, y2) => {
  return Math.ceil(Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)));
}

// Manhattan distance between two points
export const manhattan = (x1, y1, x2, y2) => {
  return Math.abs(x1-x2) + Math.abs(y1-y2);
}


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
