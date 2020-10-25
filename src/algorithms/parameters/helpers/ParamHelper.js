/* eslint-disable no-param-reassign */
import React from 'react';
import ParamMsg from './ParamMsg';

export const commaSeparatedNumberListValidCheck = (t) => {
  const regex = /^[0-9]+(,[0-9]+)*$/g;
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

/**
 *
 * @param {string} type algorithm type
 */
export const successParamMsg = (type) => (
  <ParamMsg
    logWarning={false}
    logTag="Great success!"
    logMsg={`The ${type} algorithm is now ready for execution.`}
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
 *
 * @returns {string} success message
 */
export const finishedAlgorithmMsg = () => (
  <ParamMsg
    logWarning={false}
    logTag="Great success!"
    logMsg="The algorithm has finished executing."
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
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    const data = {};
    for (let j = 0; j < len; j += 1) {
      data[`col${j}`] = symmetric
        ? `${rows[i][j]}`
        : `${getRandomInt(min, max)}`;
    }
    arr.push(data);
  }
  return arr;
};
