import DEFAULT_NODES from '../../../algorithms/parameters/HSParam.js';
import React, { useState, useEffect, useMemo } from 'react';
import algorithms from '../../../algorithms';

const DEFAULT_ALGORITHM = 'heapSort';
const DEFAULT_MODE = 'sort';
const DEFAULT_PARAM = 'list=1,5,3,4,5&value=2&xyCoords=3-4,7-1&edgeWeights=1-2-3,1-1-1&start=1&end=2&string=abcde&pattern=abc&union=1-2,3-4';


// all the parameter types and their examples:
// list: 1,2,3,4
// value: 2
// xy-coords: 3-4,x-y  // node 1 has coord (3,4)
// edge-weights: 1-2-3,1-4-2  // node 1 to node 2 has edge weight 3
// start: 1
// end: 2
// string: abcde
// pattern: abcde
// union: 1-2,3-4
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
    const alg = urlParams.get('alg') || DEFAULT_ALGORITHM;  // Provide a default algorithm if none specified
    const mode = urlParams.get('mode') || DEFAULT_MODE;    // Provide a default mode if none specified
    let param = urlParams.get('param') || DEFAULT_PARAM; // Provide a default parameter if none specified
    // Remove the curly braces
    param = param.replace(/^\{|\}$/g, '');  // This regex removes { at the start and } at the end

    console.log("URL Params:", { alg, mode, param });
    console.log("Raw URL alg:", urlParams.get('alg'));
    console.log("Raw URL mode:", urlParams.get('mode'));
    console.log("Raw URL param:", urlParams.get('param'));

    return { alg, mode, param };
}

export function parseParam(paramString) {
    if (!paramString) return {
        list: '',
        value: '',
        xyCoords: '',
        edgeWeights: '',
        start: '',
        end: '',
        string: '',
        pattern: '',
        union: ''
    };

    const params = {
        list: extractValue(paramString, 'list'),
        value: extractValue(paramString, 'value'),
        xyCoords: extractValue(paramString, 'coords'),
        edgeWeights: extractValue(paramString, 'edges'),
        start: extractValue(paramString, 'start'),
        end: extractValue(paramString, 'end'),
        string: extractValue(paramString, 'string'),
        pattern: extractValue(paramString, 'pattern'),
        union: extractValue(paramString, 'union')
    };

    console.log("Parsed Params:", params);
    return params;
}

// function extractList(paramString, key) {
//     const regex = new RegExp(`${key}=([^&]*)`);
//     const match = paramString.match(regex);
//     return match ? match[1].split(',').map(Number) : [];
// }

function extractValue(paramString, key) {
    const regex = new RegExp(`${key}=([^&]*)`);
    const match = paramString.match(regex);
    return match ? match[1] : null;
}

export const withAlgorithmParams = (WrappedComponent) => {
    const WithAlgorithmParams = (props) => {
        const { alg, mode, param } = useUrlParams();
        const parsedParams = parseParam(param);

        if (!alg || !mode || !(alg in algorithms && mode in algorithms[alg].pseudocode)) {
            return <div>Invalid algorithm or mode specified</div>;
        }

        return <WrappedComponent alg={alg} mode={mode} {...parsedParams} {...props} />;
    };

    // Set display name for easier debugging
    WithAlgorithmParams.displayName = `WithAlgorithmParams(${getDisplayName(WrappedComponent)})`;
    return WithAlgorithmParams;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
// export function parseNodes(initialNodes) {
//     console.log("Input to parseNodes:", initialNodes);
//     if (!initialNodes) return DEFAULT_NODES;

//     try {
//         // const strippedParam = initialNodes.replace(/^\[|\]$/g, ''); # list=[]
//         const nodes = initialNodes.split(',').map(Number);
//         console.log("Parsed Nodes:", nodes);  // Check parsed nodes
//         return nodes;

//     } catch (error) {
//         console.error("Error parsing nodes from URL:", error);
//         return DEFAULT_NODES;
//     }
// }

// Try:
// https://dev-aia.vercel.app/?alg=heapSort&mode=sort&param={list=1,3,5,2,8}
// http://localhost:3000/?alg=heapSort&mode=sort&param={list=1,3,5,2,8}




