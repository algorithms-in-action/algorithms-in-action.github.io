import DEFAULT_NODES from '../../../algorithms/parameters/HSParam.js';
import React, { useState, useEffect, useMemo } from 'react';
import algorithms from '../../../algorithms';

const DEFAULT_ALGORITHM = 'heapSort';
const DEFAULT_MODE = 'sort';
const DEFAULT_LIST = '1,5,3,4,5,10,2,4,7,3';
const DEFAULT_VALUE = '2';
const DEFAULT_XY_COORDS = '2-1,1-1';
const DEFAULT_EDGE_WEIGHTS = '1-2-3,1-1-1';
const DEFAULT_SIZE = '2'
const DEFAULT_START = '1';
const DEFAULT_END = '2';
const DEFAULT_STRING = 'abcde';
const DEFAULT_PATTERN = 'abc';
const DEFAULT_UNION = '1-2,3-4';
const DEFAULT_HEURISTIC = 'Euclidean'
const DEFAULT_MIN = '1'
const DEFAULT_MAX = '10'

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
    const alg = urlParams.get('alg') || DEFAULT_ALGORITHM;  // Default algorithm
    const mode = urlParams.get('mode') || DEFAULT_MODE;    // Default mode

    // Parse individual parameters directly from URL
    const list = urlParams.get('list') || DEFAULT_LIST;
    const value = urlParams.get('value') || DEFAULT_VALUE;
    const xyCoords = urlParams.get('xyCoords') || DEFAULT_XY_COORDS;
    const edgeWeights = urlParams.get('edgeWeights') || DEFAULT_EDGE_WEIGHTS;
    const size = urlParams.get('size') || DEFAULT_SIZE;
    const start = urlParams.get('start') || DEFAULT_START;
    const end = urlParams.get('end') || DEFAULT_END;
    const string = urlParams.get('string') || DEFAULT_STRING;
    const pattern = urlParams.get('pattern') || DEFAULT_PATTERN;
    const union = urlParams.get('union') || DEFAULT_UNION;
    const heuristic = urlParams.get('heuristic') || DEFAULT_HEURISTIC;
    const min = urlParams.get('min') || DEFAULT_MIN;
    const max = urlParams.get('max') || DEFAULT_MAX;

    console.log("Raw URL alg:", urlParams.get('alg'));
    console.log("Raw URL mode:", urlParams.get('mode'));
    console.log("Parsed URL Params:", { list, value, xyCoords, edgeWeights, size, start, end, string, pattern, union, heuristic, min, max });

    return { alg, mode, list, value, xyCoords, edgeWeights, start, end, string, pattern, union };
}

export const withAlgorithmParams = (WrappedComponent) => {
    const WithAlgorithmParams = (props) => {
        const { alg, mode, list, value, xyCoords, edgeWeights, size, start, end, string, pattern, union, heuristic, min, max } = useUrlParams();

        if (!alg || !mode || !(alg in algorithms && mode in algorithms[alg].pseudocode)) {
            return <div>Invalid algorithm or mode specified</div>;
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

    // Set display name for easier debugging
    WithAlgorithmParams.displayName = `WithAlgorithmParams(${getDisplayName(WrappedComponent)})`;
    return WithAlgorithmParams;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// // https://dev-aia.vercel.app/?alg=heapSort&mode=sort&list=1,3,5,2,8
// // http://localhost:3000/?alg=heapSort&mode=sort&list=1,3,5,2,8
