/* eslint quote-props: 0 */
import React from 'react';
import * as Explanation from './explanations';
import * as Param from './parameters';
import * as ExtraInfo from './extra-info';
import * as Controller from './controllers';
import * as Pseudocode from './pseudocode';
import * as Instructions from './instructions';

// Allowing dyanmic module injection
/* eslint import/namespace: ["error", { "allowComputed": true }] */
import algorithmMetadata from './masterList.js';

const getAlgorithms = (meta) =>
  Object.fromEntries(
    Object.entries(meta).map(([id, m]) => {
      const ParamModule = Param[m.paramKey];
      const explanationModule = Explanation[m.explanationKey];
      const instructionsModule = Instructions[m.instructionsKey];
      const extraInfoModule = ExtraInfo[m.extraInfoKey];

      const pseudocodeValue = Object.fromEntries(
        Object.entries(m.pseudocode).map(([mode, key]) => [mode, Pseudocode[key]])
      );

      const controllerValue = Object.fromEntries(
        Object.entries(m.controller).map(([mode, key]) => [mode, Controller[key]])
      );

      return [
        id,
        {
          name: m.name,
          category: m.category,
          // TODO: Run mapper in master list so its never undefined
          noDeploy: (m.noDeploy !== undefined ? m.noDeploy : true),
          keyword: (m.keywords !== undefined ? m.keywords : []),
          explanation: explanationModule,
          param: <ParamModule />,
          instructions: instructionsModule,
          extraInfo: extraInfoModule,
          pseudocode: pseudocodeValue,
          controller: controllerValue,
        },
      ];
    })
  );

const allalgs = getAlgorithms(algorithmMetadata);

/**
 * Get the first mode of an algorithm
 * @param {string} key algorithm's name
 */
export const getDefaultMode = (key) => Object.keys(allalgs[key].pseudocode)[0];

/**
 * Get the category of an algorithm
 * @param {string} key algorithm's name
 */
export const getCategory = (key) => allalgs[key].category;

// This function generates a list of algorithms classed by categories
const generateAlgorithmCategoryList = (deployOnly=false) => {
  const src = deployOnly
  ? Object.fromEntries(Object.entries(allalgs).filter(a => !a[1].noDeploy))
  : allalgs;

  const alCatList = [];
  let categoryNum = 0;

  // Get all the categories
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(src)) {
    if (!alCatList.some((al) => al.category === value.category)) {
      alCatList.push({
        category: value.category,
        id: categoryNum,
        algorithms: [],
      });
      categoryNum += 1;
    }
  }

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(src)) {
    const algo = alCatList.find((al) => al.category === value.category);
    algo.algorithms.push({
      name: value.name,
      shorthand: key,
      mode: getDefaultMode(key),
      keywords: value.keywords,
    });
  }

  return alCatList;
};

// This function generates a list of algorithms classed by categories
const generateAlgorithmList = (deployOnly = false) => {
  const src = deployOnly
    ? Object.fromEntries(Object.entries(allalgs).filter((a) => !a[1].noDeploy))
    : allalgs;

  const alList = [];
  let alNum = 0;

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(src)) {
    alList.push({
      name: value.name,
      shorthand: key,
      id: alNum,
      mode: getDefaultMode(key),
    });
    alNum += 1;
  }

  return alList;
};

export default allalgs;
export const AlgorithmCategoryList = generateAlgorithmCategoryList();
export const AlgorithmList = generateAlgorithmList();
export const AlgorithmNum = generateAlgorithmList().length;
export const DeployedAlgorithms = generateAlgorithmCategoryList(true);