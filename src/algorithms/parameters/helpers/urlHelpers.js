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
    'heuristic', 'min', 'max'
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
    max: ''
};


export function useUrlParams() {
    const [search, setSearch] = useState(window.location.search);

    useEffect(() => {
        const handleUrlChange = () => {
            setSearch(window.location.search);
        };

        window.addEventListener('popstate', handleUrlChange);
        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, []);

    const urlParams = useMemo(() => new URLSearchParams(search), [search]);
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

        const { alg, mode, list, value, xyCoords, edgeWeights, size, start, end, string, pattern, union, heuristic, min, max } = useUrlParams();

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


