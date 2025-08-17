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
          explanation: explanationModule,
          // Can not use <Component/> syntatic sugar
          // here because of the dynamic injection of module.
          param: React.createElement(ParamModule, null),
          instructions: instructionsModule,
          extraInfo: extraInfoModule,
          pseudocode: pseudocodeValue,
          controller: controllerValue,
        },
      ];
    })
  );

const allalgs = getAlgorithms(algorithmMetadata);

export default allalgs;