/* eslint-env jest */

jest.mock('../../../context/GlobalState', () => ({}));
jest.mock('../../../context/actions', () => ({}));
jest.mock('../../../algorithms', () => ({}));

import { renderHook, act } from '@testing-library/react-hooks';
import { useUrlParams } from '../../../algorithms/parameters/helpers/urlHelpers';

// Helper function to change the URL
const setMockUrl = (url) => {
    window.history.pushState({}, 'Test page', url);
};

describe('useUrlParams', () => {
    it('should parse default values when no alg, mode, or parameters are provided', () => {
        setMockUrl('/');

        const { result } = renderHook(() => useUrlParams());

        expect(result.current).toEqual({
            alg: 'heapSort', // Default algorithm
            mode: 'sort',    // Default mode
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
        });
    });


    it('should parse valid URL parameters', () => {
        setMockUrl('/?alg=binarySearchTree&mode=search&list=1,2,3&value=5&xyCoords=1-1,2-2&edgeWeights=1-2-3');

        const { result } = renderHook(() => useUrlParams());

        expect(result.current).toEqual({
            alg: 'binarySearchTree',
            mode: 'search',
            list: '1,2,3',
            value: '5',
            xyCoords: '1-1,2-2',
            edgeWeights: '1-2-3',
            size: '',
            start: '',
            end: '',
            string: '',
            pattern: '',
            union: '',
            heuristic: '',
            min: '',
            max: '',
        });
    });
});

describe('radix URL parameter', () => {
    it('reads radix and defaults it to empty', () => {
        setMockUrl('/?alg=trie&mode=operations&list=5,7&radix=4');
        expect(renderHook(() => useUrlParams()).result.current).toMatchObject({ alg: 'trie', list: '5,7', radix: '4' });
        setMockUrl('/?alg=trie&mode=operations');
        expect(renderHook(() => useUrlParams()).result.current.radix).toBe('');
    });
});
