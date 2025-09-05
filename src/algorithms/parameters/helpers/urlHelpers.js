import React, { useState, useEffect, useMemo } from 'react';
import algorithms from '../../../algorithms';

// const DEFAULT_ALGORITHM = 'heapSort';
// const DEFAULT_MODE = 'sort';
// const DEFAULT_LIST = '1,5,3,4,5,10,2,4,7,3';
// const DEFAULT_VALUE = '2';
// const DEFAULT_XY_COORDS = '2-1,1-1';
// const DEFAULT_EDGE_WEIGHTS = '1-2-3,1-1-1';
// const DEFAULT_SIZE = '2'
// const DEFAULT_START = '1';
// const DEFAULT_END = '2';
// const DEFAULT_STRING = 'abcde';
// const DEFAULT_PATTERN = 'abc';
// const DEFAULT_UNION = '1-2,3-4';
// const DEFAULT_HEURISTIC = 'Euclidean'
// const DEFAULT_MIN = '1'
// const DEFAULT_MAX = '10'

// List of valid parameter names
const VALID_PARAM_NAMES = [
    'alg', 'mode', 'list', 'value', 'xyCoords', 'edgeWeights',
    'size', 'start', 'end', 'string', 'pattern', 'union',
    'heuristic', 'min', 'max', 'step', 'expand', 'weight', 'compress', 'smallTable'
];

// Default values for each parameter
const DEFAULT_VALUES = {
    alg: 'heapSort',
    mode: 'sort',
    list: '',
    value: '',
    xyCoords: '',
    edgeWeights: '',
    size: '',
    start: '',
    end: '',
    string: '',
    pattern: '',
    union: '',
    heuristic: '',
    min: '',
    max: '',
    step: '0',
    expand: '{}'
};


export function useUrlParams() {
    const urlParams = new URLSearchParams(window.location.search)
    const params = {};

    // Filter and parse valid URL parameters
    VALID_PARAM_NAMES.forEach((name) => {
        const value = urlParams.get(name);
        params[name] = value !== null ? value : DEFAULT_VALUES[name];
    });

    // Log a warning if there are any invalid parameters in the URL
    urlParams.forEach((_, key) => {
        if (!VALID_PARAM_NAMES.includes(key)) {
            console.warn(`Invalid URL parameter ignored: ${key}`);
        }
    });

    // console.log("Raw URL alg:", urlParams.get('alg'));
    // console.log("Raw URL mode:", urlParams.get('mode'));
    // console.log("Parsed URL Params:", { list, value, xyCoords, edgeWeights, size, start, end, string, pattern, union, heuristic, min, max });

    return params;
}



function extractValue(paramString, key) {
    const regex = new RegExp(`${key}=([^;]*)`);
    const match = paramString.match(regex);
    return match ? match[1] : null;
}

export const withAlgorithmParams = (WrappedComponent) => {
    const WithAlgorithmParams = (props) => {

        const { alg, mode, list, value, xyCoords, edgeWeights, size, start, end, string, pattern, union, heuristic, min, max, weight, compress, smallTable } = useUrlParams();

        if (!alg || !(alg in algorithms)) {
            return <div>Invalid algorithm specified</div>;
        }

        if (!mode || !(mode in algorithms[alg].pseudocode)) {
            return <div>Invalid mode specified</div>;
        }

        return <WrappedComponent
            alg={alg}
            mode={mode}
            list={list}
            value={value}
            xyCoords={xyCoords}
            edgeWeights={edgeWeights}
            size={size}
            start={start}
            end={end}
            string={string}
            pattern={pattern}
            union={union}
            heuristic={heuristic}
            min={min}
            max={max}
            weight={weight}
            compress={compress}
            smallTable={smallTable}
            {...props}
        />;

    };

    // Set display name for debugging purposes
    WithAlgorithmParams.displayName = `WithAlgorithmParams(${getDisplayName(WrappedComponent)})`;
    return WithAlgorithmParams;
};


// Helper function to get the display name of a component
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// prepend graph from URL if defined
export function addURLGraph(GRAPH_EGS, xyCoords, edgeWeights, start, DEFAULT_START) {
  let graph_egs = [...GRAPH_EGS];
  // XXX using size causes weirdness - BFSParam() somehow gets
  // re-evaluated when we cycle around to the URL graph and size and/or
  // other things get out of whack - maybe something gets triggered,
  // maybe because the identifier size is overloaded in different ways -
  // someone who know JS better than me might be able to figure it out.
  // So, we avoid using the size parameter and use number of xyCoords
  // (if defined) or GRAPH_EGS[0].size otherwise.
  let size1 = GRAPH_EGS[0].size;
  // if coords+weights non-empty we must have info from the URL so we add an
  // extra graph to the start of the list
  if (xyCoords && edgeWeights) {
    size1 = xyCoords.split(",").length;
    const urlGraph =  {
      name: 'URL Graph',
          size: size1,
          coords: xyCoords,
          edges: edgeWeights
    };
    graph_egs.unshift({...urlGraph});
  } else {
    start = DEFAULT_START
  }
  if (start > size1)
    start = size1;
  // XXX should pass in end node(s) and check they are in range???
  return [start, size1, graph_egs];
}

// https://dev-aia.vercel.app/?alg=heapSort&mode=sort&list=1,3,5,2,8
// http://localhost:3000/?alg=heapSort&mode=sort&list=1,3,5,2,8
// http://localhost:3000/?alg=aStar&mode=find&size=4&start=1&end=4&min=1&max=30&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-3-2,1-4-3,2-3-1,2-4-2&heuristic=Euclidean
// http://localhost:3000/?alg=aStar&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean
// http://localhost:3000/?alg=BFS&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean
// http://localhost:3000/?alg=bruteForceStringSearch&mode=search&string=abcdef&pattern=def
// http://localhost:3000/?alg=binarySearchTree&mode=search&list=1,5,2,6,6&value=5
// http://localhost:3000/?alg=DFS&mode=find&size=4&start=1&end=4&xyCoords=1-10,2-2,3-1,8-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=0&max=10 // why min, max not working?
// http://localhost:3000/?alg=DFSrec&mode=find&size=4&start=1&end=4&xyCoords=1-10,2-2,3-1,8-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=0&max=10
// http://localhost:3000/?alg=dijkstra&mode=find&size=4&start=1&end=4&xyCoords=1-10,2-2,3-1,8-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=0&max=10
// http://localhost:3000/?alg=horspoolStringSearch&mode=search&string=abcdef&pattern=def
// http://localhost:3000/?alg=kruskal&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=1&max=30
// http://localhost:3000/?alg=prim_old&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=1&max=30
// http://localhost:3000/?alg=prim&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=1&max=30
// http://localhost:3000/?alg=transitiveClosure&mode=tc&size=5&min=0&max=1
// http://localhost:3000/?alg=TTFTree&mode=search&list=1,5,2,6&value=5 //cannot accept duplicate values in the list
// http://localhost:3000/?alg=unionFind&mode=find&union=1-1,5-10,2-3,6-6&value=5


