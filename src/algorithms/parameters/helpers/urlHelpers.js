import DEFAULT_NODES from '../../../algorithms/parameters/HSParam.js';
import { useState, useEffect, useMemo } from 'react';

const DEFAULT_ALGORITHM = 'heapSort';
const DEFAULT_MODE ='sort';
const DEFAULT_PARAM = '[1,5,3,4,5]';

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
    const param = urlParams.get('param') || DEFAULT_PARAM; // Provide a default parameter if none specified

    console.log("URL Params:", { alg, mode, param });
    console.log("Raw URL alg:", urlParams.get('alg'));
    console.log("Raw URL mode:", urlParams.get('mode'));
    console.log("Raw URL param:", urlParams.get('param'));

    return { alg, mode, param };
}


export function parseNodes(initialNodes) {
    console.log("Input to parseNodes:", initialNodes);
    if (!initialNodes) return DEFAULT_NODES;

    try {
        const strippedParam = initialNodes.replace(/^\[|\]$/g, '');
        const nodes = strippedParam.split(',').map(Number);
        console.log("Parsed Nodes:", nodes);  // Check parsed nodes
        return nodes;

    } catch (error) {
        console.error("Error parsing nodes from URL:", error);
        return DEFAULT_NODES;
    }
}

// Try:
// https://dev-aia.vercel.app/?alg=heapSort&mode=sort&param=[1,3,-5,2,8]
// http://localhost:3000/?alg=heapSort&mode=sort&param=[1,3,-5,2,8]




