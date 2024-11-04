/* eslint-env jest */

// Check out AlgorithmSelection.test.js

// import { render, screen } from '@testing-library/react';
// import { createMemoryHistory } from 'history';
// import React from 'react';
// import { Router } from 'react-router-dom';
// import '@testing-library/jest-dom/extend-expect';
// import App from '../../../App';

// test('navigates to Heapsort page when entering the Heapsort URL', async () => {
//     const history = createMemoryHistory();

//     // Set the initial URL to match the desired test URL
//     history.push('/?alg=quickSort&mode=sort');

//     render(
//         <Router history={history}>
//             <App />
//         </Router>
//     );

//     // // Wait for the elements to appear and check for the presence of the first element
//     // const heapsortElements = await screen.findAllByText(/Heapsort/i);
//     // // Log the elements to see what they contain
//     // console.log(`heapsortElements:`, heapsortElements);
//     // expect(heapsortElements[0]).toBeInTheDocument();
//     console.log(`Current URL: ${history.location.pathname}${history.location.search}`);

//     const algorithmTitle = screen.getByText('Quicksort', { selector: '#algorithmTitle' });
//     console.log(`algorithmTitle:`, algorithmTitle);
//     expect(algorithmTitle).toBeInTheDocument();

// });



// import { renderHook } from '@testing-library/react-hooks';
// import { useUrlParams } from './urlHelpers'; // Adjust the path as needed

// // Test case for useUrlParams
// test('correctly parses URL parameters', () => {
//     // Mock the window location search
//     delete window.location; // Remove default location
//     window.location = { search: '?alg=prim&mode=find' }; // Mocked URL parameters

//     const { result } = renderHook(() => useUrlParams());

//     // Check if URL parameters are correctly parsed
//     expect(result.current.alg).toBe('prim');
//     expect(result.current.mode).toBe('find');
//     expect(result.current.list).toBe('1,3,5,2,8');
// });



// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import App from '../../../App';

// test('navigates to Heapsort page when entering the Heapsort URL', () => {
//     // Mock window.location to simulate URL with query params
//     delete window.location;
//     window.location = new URL('http://localhost/?alg=heapSort&mode=sort');

//     render(
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     );

//     // Print the rendered screen to see all elements on the page
//     screen.debug();

//     // Test that Heapsort elements are rendered based on the URL params
//     const heapsortElements = screen.getAllByText(/Heapsort/i);
//     console.log(`heapsortElements:`, heapsortElements);
//     expect(heapsortElements[0]).toBeInTheDocument();
// });



// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import App from '../../../App';

// test('displays the correct algorithm page based on URL parameter', () => {
//     delete window.location;
//     window.location = new URL('http://localhost/?alg=quickSort&mode=sort');

//     render(
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     );

//     // Use getAllByText and find the specific element by additional properties
//     const heapsortElements = screen.getAllByText(/Quicksort/i);

//     // Log the elements to identify the specific one, if needed
//     console.log("Heapsort Elements:", heapsortElements);

//     // Assume the target element has a specific className or ID
//     const targetElement = heapsortElements.find(
//         (el) => el.className === "algorithmTitle"
//     );
//     expect(targetElement).toBeInTheDocument();
// });



// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import App from '../../../App';

// describe('Algorithm Pages Rendering', () => {
//   const testCases = [
//     { algorithm: 'heapSort', mode: 'sort', title: 'Heapsort' },
//     { algorithm: 'quickSort', mode: 'sort', title: 'Quicksort' },
//     { algorithm: 'quickSortM3', mode: 'sort', title: 'Quicksort (Median of 3)' },
//     { algorithm: 'msort_arr_td', mode: 'sort', title: 'Mergesort' },
//     { algorithm: 'msort_lista_td', mode: 'sort', title: 'Mergesort (list)' },
//     { algorithm: 'binarySearchTree', mode: 'search', title: 'Binary Search Tree' },
//     { algorithm: 'TTFTree', mode: 'search', title: '2-3-4 Tree' },
//     { algorithm: 'DFSrec', mode: 'find', title: 'Depth First Search' },
//     { algorithm: 'DFS', mode: 'find', title: 'DFS (Iterative)' },
//     { algorithm: 'BFS', mode: 'find', title: 'Breadth First Search' },
//     { algorithm: 'dijkstra', mode: 'find', title: 'Dijkstra’s (shortest path)' },
//     { algorithm: 'aStar', mode: 'find', title: 'A* (heuristic search)' },
//     { algorithm: 'prim', mode: 'find', title: 'Prim’s (min. spanning tree)' },
//     { algorithm: 'prim_old', mode: 'find', title: 'Prim’s (simpler code)' },
//     { algorithm: 'kruskal', mode: 'find', title: 'Kruskal’s (min. spanning tree)' },
//     { algorithm: 'transitiveClosure', mode: 'tc', title: 'Warshall’s (transitive closure)' },
//     { algorithm: 'unionFind', mode: 'find', title: 'Union Find' },
//     { algorithm: 'bruteForceStringSearch', mode: 'search', title: 'Brute Force' },
//     { algorithm: 'horspoolStringSearch', mode: 'search', title: 'Horspool’s' },
//   ];

//   testCases.forEach(({ algorithm, mode, title }) => {
//     test(`displays the ${title} page based on URL parameter: alg=${algorithm}, mode=${mode}`, () => {
//       delete window.location;
//       window.location = new URL(`http://localhost:3000/?alg=${algorithm}&mode=${mode}`);

//       render(
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       );

//       // Verify that the correct page title is displayed
//       const algorithmElements = screen.getAllByText(new RegExp(title, 'i'));

//       // Assume the target element has a specific className or ID
//       const algorithmTitle = algorithmElements.find(
//         (el) => el.className === "algorithmTitle"
//       );

//       expect(algorithmTitle).toBeInTheDocument();
//     });
//   });
// });



// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { waitFor } from '@testing-library/react';
// import App from '../../../App';

// describe('Algorithm Pages Rendering', () => {
//   const testCases = [
//     { algorithm: 'heapSort', mode: 'sort', title: 'Heapsort' },
//     { algorithm: 'quickSort', mode: 'sort', title: 'Quicksort' },
//     { algorithm: 'quickSortM3', mode: 'sort', title: 'Quicksort (Median of 3)' },
//     { algorithm: 'msort_arr_td', mode: 'sort', title: 'Mergesort' },
//     { algorithm: 'msort_lista_td', mode: 'sort', title: 'Mergesort (list)' },
//     { algorithm: 'binarySearchTree', mode: 'search', title: 'Binary Search Tree' },
//     { algorithm: 'TTFTree', mode: 'search', title: '2-3-4 Tree' },
//     { algorithm: 'DFSrec', mode: 'find', title: 'Depth First Search' },
//     { algorithm: 'DFS', mode: 'find', title: 'DFS (Iterative)' },
//     { algorithm: 'BFS', mode: 'find', title: 'Breadth First Search' },
//     { algorithm: 'dijkstra', mode: 'find', title: 'Dijkstra’s (shortest path)' },
//     { algorithm: 'aStar', mode: 'find', title: 'A* (heuristic search)' },
//     { algorithm: 'prim', mode: 'find', title: 'Prim’s (min. spanning tree)' },
//     { algorithm: 'prim_old', mode: 'find', title: 'Prim’s (simpler code)' },
//     { algorithm: 'kruskal', mode: 'find', title: 'Kruskal’s (min. spanning tree)' },
//     { algorithm: 'transitiveClosure', mode: 'tc', title: 'Warshall’s (transitive closure)' },
//     { algorithm: 'unionFind', mode: 'find', title: 'Union Find' },
//     { algorithm: 'bruteForceStringSearch', mode: 'search', title: 'Brute Force' },
//     { algorithm: 'horspoolStringSearch', mode: 'search', title: 'Horspool’s' },
//   ];

//   testCases.forEach(({ algorithm, mode, title }) => {
//     test(`displays the ${title} page based on URL parameter: alg=${algorithm}, mode=${mode}`, async () => {
//     //   // Simulate URL with specific algorithm and mode parameters
//     //   beforeEach(() => {
//     //     delete window.location;
//     //     window.location = new URL('http://localhost:3000/?alg=heapSort&mode=sort');
//     //   });

//       render(
//         <MemoryRouter initialEntries={[`/?alg=${algorithm}&mode=${mode}`]}>
//           <App />
//         </MemoryRouter>
//       );

//       // Print the rendered screen to see all elements on the page
//       screen.debug();

//       await waitFor(() => {
//         const algorithmTitle = screen.getByText(new RegExp(title, 'i'));
//         expect(algorithmTitle).toBeInTheDocument();
//       });
//     });
//   });
// });


// import React, { useContext } from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { GlobalProvider, GlobalContext } from '../../../context/GlobalState';
// import App from '../../../App';

// // Test component to display current global algorithm state for assertions
// const TestComponent = () => {
//   const { algorithm } = useContext(GlobalContext);
//   return <div data-testid="algorithm-name">{algorithm.name}</div>;
// };

// describe('Global State Algorithm Changes Based on URL', () => {
//   const testCases = [
//     { url: '/?alg=heapSort&mode=sort', expectedAlgorithm: 'heapSort' },
//     { url: '/?alg=quickSort&mode=sort', expectedAlgorithm: 'quickSort' },
//     { url: '/?alg=DFS&mode=find', expectedAlgorithm: 'DFS' },
//     // Add more test cases as needed
//   ];

//   testCases.forEach(({ url, expectedAlgorithm }) => {
//     test(`updates global state algorithm to ${expectedAlgorithm} for URL ${url}`, async () => {
//       render(
//         <MemoryRouter initialEntries={[url]}>
//           <GlobalProvider>
//             <TestComponent />
//           </GlobalProvider>
//         </MemoryRouter>
//       );

//       await waitFor(() => {
//         const algorithmName = screen.getByTestId('algorithm-name');
//         expect(algorithmName).toHaveTextContent(expectedAlgorithm);
//       });
//     });
//   });
// });


// src/algorithms/parameters/helpers/urlHelpers.test.js

// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import App from '../../../App'; // Adjusted path for App component

// // Mock GlobalState context to use mock algorithms
// jest.mock('../../../context/GlobalState', () => {
//   // Define mock algorithms within the mock function scope
//   const mockAlgorithms = {
//     heapSort: {
//       name: 'Heap Sort',
//       description: 'Sorting algorithm using heap structure',
//       pseudocode: { sort: [] },
//     },
//     binarySearch: {
//       name: 'Binary Search',
//       description: 'Search algorithm using binary tree structure',
//       pseudocode: { search: [] },
//     },
//   };

//   return {
//     algorithms: mockAlgorithms,
//   };
// });

// describe('URL Helper Tests', () => {
//   test('loads Heap Sort page when URL is /?alg=heapSort&mode=sort', async () => {
//     render(
//       <MemoryRouter initialEntries={['/?alg=heapSort&mode=sort']}>
//         <App />
//       </MemoryRouter>
//     );

//     // Check if Heap Sort algorithm page loads correctly
//     const algorithmTitle = await screen.findByText(/Heap Sort/i);
//     const algorithmDescription = screen.getByText(/Sorting algorithm using heap structure/i);

//     expect(algorithmTitle).toBeInTheDocument();
//     expect(algorithmDescription).toBeInTheDocument();
//   });

//   test('loads Binary Search page when URL is /?alg=binarySearch&mode=search', async () => {
//     render(
//       <MemoryRouter initialEntries={['/?alg=binarySearch&mode=search']}>
//         <App />
//       </MemoryRouter>
//     );

//     // Check if Binary Search algorithm page loads correctly
//     const algorithmTitle = await screen.findByText(/Binary Search/i);
//     const algorithmDescription = screen.getByText(/Search algorithm using binary tree structure/i);

//     expect(algorithmTitle).toBeInTheDocument();
//     expect(algorithmDescription).toBeInTheDocument();
//   });

//   test('displays default algorithm page when invalid URL parameters are provided', async () => {
//     render(
//       <MemoryRouter initialEntries={['/?alg=nonExistent&mode=unknown']}>
//         <App />
//       </MemoryRouter>
//     );

//     // Check if default algorithm (e.g., Heap Sort) loads correctly
//     const algorithmTitle = await screen.findByText(/Heap Sort/i);
//     const algorithmDescription = screen.getByText(/Sorting algorithm using heap structure/i);

//     expect(algorithmTitle).toBeInTheDocument();
//     expect(algorithmDescription).toBeInTheDocument();
//   });
// });


// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import App from '../../../App'; // Adjust the path if necessary
// import '@testing-library/jest-dom/extend-expect';

// // Mock GlobalState context
// jest.mock('../../../context/GlobalState', () => {
//     const mockAlgorithms = {
//         heapSort: { name: 'Heap Sort', mode: 'sort', content: 'Heap Sort Algorithm' },
//         binarySearch: { name: 'Binary Search', mode: 'search', content: 'Binary Search Algorithm' },
//     };

//     return {
//         GlobalProvider: ({ children }) => <div>{children}</div>,
//         useGlobalState: () => ({ algorithms: mockAlgorithms }),
//     };
// });

// // Define URL Helper Tests
// describe('URL Helper Tests', () => {
//     test('loads Heap Sort page when URL is /?alg=heapSort&mode=sort', async () => {
//         render(
//             <MemoryRouter initialEntries={['/?alg=heapSort&mode=sort']}>
//                 <App />
//             </MemoryRouter>
//         );
//         expect(screen.getByText('Heap Sort Algorithm')).toBeInTheDocument();
//     });

//     test('loads Binary Search page when URL is /?alg=binarySearch&mode=search', async () => {
//         render(
//             <MemoryRouter initialEntries={['/?alg=binarySearch&mode=search']}>
//                 <App />
//             </MemoryRouter>
//         );
//         expect(screen.getByText('Binary Search Algorithm')).toBeInTheDocument();
//     });

//     test('displays default algorithm page when invalid URL parameters are provided', async () => {
//         render(
//             <MemoryRouter initialEntries={['/?alg=nonExistent&mode=unknown']}>
//                 <App />
//             </MemoryRouter>
//         );
//         expect(screen.getByText('Default Algorithm')).toBeInTheDocument();
//     });
// });


// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import App from '../../../App'; // Adjust the path if necessary
// import '@testing-library/jest-dom/extend-expect';

// // Mocking GlobalState context
// jest.mock('../../../context/GlobalState', () => {
//     const mockAlgorithms = {
//         heapSort: { name: 'Heap Sort', mode: 'sort', content: 'Heap Sort Algorithm' },
//         binarySearch: { name: 'Binary Search', mode: 'search', content: 'Binary Search Algorithm' },
//     };

//     return {
//         GlobalProvider: ({ children }) => <div>{children}</div>,
//         useGlobalState: () => ({ algorithms: mockAlgorithms }),
//     };
// });

// describe('URL Helper Tests', () => {
//     test('loads Heap Sort page when URL is /?alg=heapSort&mode=sort', async () => {
//         render(
//             <MemoryRouter initialEntries={['/?alg=heapSort&mode=sort']}>
//                 <App />
//             </MemoryRouter>
//         );
//         expect(screen.getByText('Heap Sort Algorithm')).toBeInTheDocument();
//     });

//     test('loads Binary Search page when URL is /?alg=binarySearch&mode=search', async () => {
//         render(
//             <MemoryRouter initialEntries={['/?alg=binarySearch&mode=search']}>
//                 <App />
//             </MemoryRouter>
//         );
//         expect(screen.getByText('Binary Search Algorithm')).toBeInTheDocument();
//     });

//     test('displays default algorithm page when invalid URL parameters are provided', async () => {
//         render(
//             <MemoryRouter initialEntries={['/?alg=nonExistent&mode=unknown']}>
//                 <App />
//             </MemoryRouter>
//         );
//         expect(screen.getByText('Default Algorithm')).toBeInTheDocument();
//     });
// });


// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import App from '../../../App'; // Adjust the path if necessary
// import '@testing-library/jest-dom/extend-expect';
// import { GlobalProvider, GlobalContext } from '../../../context/GlobalState'; // Update this path as needed

// // Mock GlobalState with necessary values
// const mockGlobalState = {
//     algorithms: {
//         heapSort: { name: 'Heap Sort', mode: 'sort', content: 'Heap Sort Algorithm' },
//         binarySearch: { name: 'Binary Search', mode: 'search', content: 'Binary Search Algorithm' },
//     },
//     algorithm: null,
//     dispatch: jest.fn(),
// };

// // Custom render with GlobalProvider
// const renderWithContext = (ui, { route = '/' } = {}) => {
//     return render(
//         <MemoryRouter initialEntries={[route]}>
//             <GlobalProvider value={mockGlobalState}>{ui}</GlobalProvider>
//         </MemoryRouter>
//     );
// };

// describe('URL Helper Tests', () => {
//     test('loads Heapsort page when URL is /?alg=heapSort&mode=sort', async () => {
//         renderWithContext(<App />, { route: '/?alg=heapSort&mode=sort' });
//         expect(screen.getByText('Heapsort')).toBeInTheDocument();
//     });

//     test('loads Binary Search Tree page when URL is /?alg=binarySearchTree&mode=search', async () => {
//         renderWithContext(<App />, { route: '/?alg=binarySearchTree&mode=search' });
//         expect(screen.getByText('Binary Search Tree')).toBeInTheDocument();
//     });

//     test('displays error message when invalid URL parameters are provided', async () => {
//         renderWithContext(<App />, { route: '/?alg=nonExistent&mode=unknown' });
//         expect(screen.getByText('Invalid algorithm specified')).toBeInTheDocument();
//     });
// });


// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import App from '../../../App'; // Adjust the path if necessary
// import '@testing-library/jest-dom/extend-expect';
// import { GlobalProvider } from '../../../context/GlobalState'; // Update this path as needed
// import { URLProvider } from '../../../context/urlState';

// // Mock Global State and URL State with necessary values
// const mockGlobalState = {
//     algorithm: {
//         name: 'Binary Search Tree',
//         mode: 'search',
//         content: 'Binary Search Tree Algorithm',
//     },
//     algorithmKey: 'binarySearchTree',
//     category: 'Insert/Search',
//     mode: 'search',
//     dispatch: jest.fn(),
// };

// const mockURLState = {
//     nodes: [],
//     setNodes: jest.fn(),
//     searchValue: '16',
//     setSearchValue: jest.fn(),
//     graphSize: 0,
//     setGraphSize: jest.fn(),
//     graphStart: 0,
//     setGraphStart: jest.fn(),
//     graphEnd: 0,
//     setGraphEnd: jest.fn(),
//     heuristic: '',
//     setHeuristic: jest.fn(),
//     graphMin: 0,
//     setGraphMin: jest.fn(),
//     graphMax: 0,
//     setGraphMax: jest.fn(),
// };

// // Custom render with GlobalProvider and URLProvider
// const renderWithContext = (ui, { route = '/' } = {}) => {
//     return render(
//         <MemoryRouter initialEntries={[route]}>
//             <GlobalProvider value={mockGlobalState}>
//                 <URLProvider value={mockURLState}>
//                     {ui}
//                 </URLProvider>
//             </GlobalProvider>
//         </MemoryRouter>
//     );
// };

// describe('URL Helper Tests', () => {
//     test('loads Binary Search Tree page when URL is /?alg=binarySearchTree&mode=search', async () => {
//         renderWithContext(<App />, { route: '/?alg=binarySearchTree&mode=search' });
//         expect(await screen.findByText('Binary Search Tree')).toBeInTheDocument();
//     });

//     test('displays error message when invalid URL parameters are provided', async () => {
//         renderWithContext(<App />, { route: '/?alg=nonExistent&mode=unknown' });
//         expect(await screen.findByText('Invalid algorithm specified')).toBeInTheDocument();
//     });
// });


// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import App from '../../../App';
// import '@testing-library/jest-dom/extend-expect';
// import { GlobalProvider } from '../../../context/GlobalState';
// import { URLProvider } from '../../../context/urlState';

// const mockGlobalState = {
//     algorithm: null,
//     dispatch: jest.fn(),
// };

// const mockURLState = {
//     nodes: [],
//     setNodes: jest.fn(),
//     searchValue: '',
//     setSearchValue: jest.fn(),
//     graphSize: 0,
//     setGraphSize: jest.fn(),
//     graphStart: 0,
//     setGraphStart: jest.fn(),
//     graphEnd: 0,
//     setGraphEnd: jest.fn(),
//     heuristic: '',
//     setHeuristic: jest.fn(),
//     graphMin: 0,
//     setGraphMin: jest.fn(),
//     graphMax: 0,
//     setGraphMax: jest.fn(),
// };

// // Custom render function with both GlobalProvider and URLProvider
// const renderWithContext = (ui, { route = '/' } = {}) => {
//     return render(
//         <MemoryRouter initialEntries={[route]}>
//             <GlobalProvider value={mockGlobalState}>
//                 <URLProvider value={mockURLState}>
//                     {ui}
//                 </URLProvider>
//             </GlobalProvider>
//         </MemoryRouter>
//     );
// };

// describe('URL Helper Tests', () => {
//     test('loads Binary Search Tree page when URL is /?alg=binarySearchTree&mode=search', async () => {
//         renderWithContext(<App />, { route: '/?alg=binarySearchTree&mode=search' });
//         expect(await screen.findByText('Binary Search Tree')).toBeInTheDocument();
//     });

//     test('displays error message when invalid URL parameters are provided', async () => {
//         renderWithContext(<App />, { route: '/?alg=nonExistent&mode=unknown' });

//         // Use waitFor with a longer timeout and target the footer specifically
//         await waitFor(() => {
//             const footer = document.getElementById("footer"); // Assuming `footer` has a `role="contentinfo"`
//             expect(footer).toHaveTextContent('Invalid algorithm specified');
//         }, { timeout: 2000 });

//         // Debug output if error message is not found
//         if (!screen.queryByText('Invalid algorithm specified')) {
//             console.log(screen.debug()); // Print out the DOM to inspect if the element is missing
//         }
//     });
// });


// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import App from '../../../App';
// import '@testing-library/jest-dom/extend-expect';
// import { GlobalProvider } from '../../../context/GlobalState';
// import { URLProvider } from '../../../context/urlState';

// // Mock states
// const mockGlobalState = {
//     algorithm: null,
//     dispatch: jest.fn(),
// };

// const mockURLState = {
//     nodes: [],
//     setNodes: jest.fn(),
//     searchValue: '',
//     setSearchValue: jest.fn(),
//     graphSize: 0,
//     setGraphSize: jest.fn(),
//     graphStart: 0,
//     setGraphStart: jest.fn(),
//     graphEnd: 0,
//     setGraphEnd: jest.fn(),
//     heuristic: '',
//     setHeuristic: jest.fn(),
//     graphMin: 0,
//     setGraphMin: jest.fn(),
//     graphMax: 0,
//     setGraphMax: jest.fn(),
// };

// // Custom render function with providers
// const renderWithContext = (ui, { route = '/' } = {}) => {
//     return render(
//         <MemoryRouter initialEntries={[route]}>
//             <GlobalProvider value={mockGlobalState}>
//                 <URLProvider value={mockURLState}>
//                     {ui}
//                 </URLProvider>
//             </GlobalProvider>
//         </MemoryRouter>
//     );
// };

// describe('URL Helper Tests', () => {

//     // Sorting Algorithms

//     test('loads Heapsort page when URL is /?alg=heapSort&mode=sort', async () => {
//         renderWithContext(<App />, { route: '/?alg=heapSort&mode=sort' });
//         expect(await screen.findByText('Heapsort')).toBeInTheDocument();
//     });

//     test('loads Quicksort page when URL is /?alg=quickSort&mode=sort', async () => {
//         renderWithContext(<App />, { route: '/?alg=quickSort&mode=sort' });
//         expect(await screen.findByText('Quicksort')).toBeInTheDocument();
//     });

//     test('loads Quicksort (Median of 3) page when URL is /?alg=quickSortM3&mode=sort', async () => {
//         renderWithContext(<App />, { route: '/?alg=quickSortM3&mode=sort' });
//         expect(await screen.findByText('Quicksort (Median of 3)')).toBeInTheDocument();
//     });

//     test('loads Merge Sort page when URL is /?alg=msort_arr_td&mode=sort', async () => {
//         renderWithContext(<App />, { route: '/?alg=msort_arr_td&mode=sort' });
//         expect(await screen.findByText('Merge Sort')).toBeInTheDocument();
//     });

//     // test('loads Mergesort (list) page when URL is /?alg=msort_lista_td&mode=sort', async () => {
//     //     renderWithContext(<App />, { route: '/?alg=msort_lista_td&mode=sort' });
//     //     expect(await screen.findByText('Merge Sort (lists)')).toBeInTheDocument();
//     // });

//     // Search Algorithms

//     test('loads Binary Search Tree page when URL is /?alg=binarySearchTree&mode=search', async () => {
//         renderWithContext(<App />, { route: '/?alg=binarySearchTree&mode=search' });
//         expect(await screen.findByText('Binary Search Tree')).toBeInTheDocument();
//     });

//     test('loads 2-3-4 Tree page when URL is /?alg=TTFTree&mode=search', async () => {
//         renderWithContext(<App />, { route: '/?alg=TTFTree&mode=search' });
//         expect(await screen.findByText('2-3-4 Tree')).toBeInTheDocument();
//     });

//     // Pathfinding Algorithms

//     test('loads Depth First Search page when URL is /?alg=DFSrec&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=DFSrec&mode=find' });
//         expect(await screen.findByText('Depth First Search')).toBeInTheDocument();
//     });

//     test('loads DFS (iterative) page when URL is /?alg=DFS&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=DFS&mode=find' });
//         expect(await screen.findByText('DFS (iterative)')).toBeInTheDocument();
//     });

//     test('loads Breadth First Search page when URL is /?alg=BFS&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=BFS&mode=find' });
//         expect(await screen.findByText('Breadth First Search')).toBeInTheDocument();
//     });

//     test('loads Dijkstra\'s (shortest path) page when URL is /?alg=dijkstra&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=dijkstra&mode=find' });
//         expect(await screen.findByText('Dijkstra\'s (shortest path)')).toBeInTheDocument();
//     });

//     test('loads A* (heuristic search) page when URL is /?alg=aStar&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=aStar&mode=find' });
//         expect(await screen.findByText('A* (heuristic search)')).toBeInTheDocument();
//     });

//     // Minimum Spanning Tree Algorithms

//     test('loads Prim\'s (min. spanning tree) page when URL is /?alg=prim&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=prim&mode=find' });
//         expect(await screen.findByText('Prim\'s (min. spanning tree)')).toBeInTheDocument();
//     });

//     test('loads Prim\'s (simpler code) page when URL is /?alg=prim_old&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=prim_old&mode=find' });
//         expect(await screen.findByText('Prim\'s (simpler code)')).toBeInTheDocument();
//     });

//     test('loads Kruskal\'s (min. spanning tree) page when URL is /?alg=kruskal&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=kruskal&mode=find' });
//         expect(await screen.findByText('Kruskal\'s (min. spanning tree)')).toBeInTheDocument();
//     });

//     // Miscellaneous Algorithms

//     test('loads Warshall\'s (transitive closure) page when URL is /?alg=transitiveClosure&mode=tc', async () => {
//         renderWithContext(<App />, { route: '/?alg=transitiveClosure&mode=tc' });
//         expect(await screen.findByText('Warshall\'s (transitive closure)')).toBeInTheDocument();
//     });

//     test('loads Union Find page when URL is /?alg=unionFind&mode=find', async () => {
//         renderWithContext(<App />, { route: '/?alg=unionFind&mode=find' });
//         expect(await screen.findByText('Union Find')).toBeInTheDocument();
//     });

//     test('loads Brute Force page when URL is /?alg=bruteForceStringSearch&mode=search', async () => {
//         renderWithContext(<App />, { route: '/?alg=bruteForceStringSearch&mode=search' });
//         expect(await screen.findByText('Brute Force')).toBeInTheDocument();
//     });

//     test('loads Horspool\'s page when URL is /?alg=horspoolStringSearch&mode=search', async () => {
//         renderWithContext(<App />, { route: '/?alg=horspoolStringSearch&mode=search' });
//         expect(await screen.findByText('Horspool\'s')).toBeInTheDocument();
//     });

//     test('displays error message when invalid URL parameters are provided', async () => {
//         renderWithContext(<App />, { route: '/?alg=nonExistent&mode=unknown' });

//         // Target the error message within the `parameterPanel` specifically
//         await waitFor(() => {
//             const parameterPanel = document.querySelector('.parameterPanel');
//             expect(parameterPanel).toHaveTextContent('Invalid algorithm specified');
//         }, { timeout: 2000 });

//         // Debugging output if the error message is not found
//         if (!screen.queryByText('Invalid algorithm specified')) {
//             console.log('Rendered DOM snapshot:');
//             screen.debug(undefined, 100000000); // Print out the entire rendered DOM to inspect
//             console.log(document.querySelector('.parameterPanel')?.innerHTML);
//             // Or for a specific element
//             const footer = document.getElementById('footer');
//             console.log(prettyDOM(footer));
//         }
//     });
// }); // nearly working. not passing heapsort due to multiple occurrences; not passing invalid.



// // src/algorithms/parameters/helpers/urlHelpers.test.js

// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import '@testing-library/jest-dom/extend-expect';
// import App from '../../../App';
// import { GlobalProvider } from '../../../context/GlobalState';
// import { URLProvider } from '../../../context/urlState';
// import algorithms from '../../../algorithms';

// const mockURLState = {
//     nodes: [],
//     setNodes: jest.fn(),
//     searchValue: '',
//     setSearchValue: jest.fn(),
//     graphSize: 0,
//     setGraphSize: jest.fn(),
//     graphStart: 0,
//     setGraphStart: jest.fn(),
//     graphEnd: 0,
//     setGraphEnd: jest.fn(),
//     heuristic: '',
//     setHeuristic: jest.fn(),
//     graphMin: 0,
//     setGraphMin: jest.fn(),
//     graphMax: 0,
//     setGraphMax: jest.fn(),
// };

// // Custom render function to provide both GlobalProvider and URLProvider
// const renderWithContext = (ui, { route = '/' } = {}) => {
//     return render(
//         <MemoryRouter initialEntries={[route]}>
//             <GlobalProvider>
//                 <URLProvider value={mockURLState}>
//                     {ui}
//                 </URLProvider>
//             </GlobalProvider>
//         </MemoryRouter>
//     );
// };

// describe('GlobalState and URL synchronization Tests', () => {
//     test('loads Heapsort page when URL is /?alg=heapSort&mode=sort', async () => {
//         renderWithContext(<App />, { route: '/?alg=heapSort&mode=sort' });

//         // Check if the global state is updated to Binary Search Tree
//         await waitFor(() => {
//             const algorithmKey = Object.keys(algorithms).find(
//                 key => algorithms[key].name === 'Heapsort'
//             );
//             expect(algorithmKey).toBeDefined();
//             const globalStateAlgorithm = algorithms[algorithmKey];
//             expect(globalStateAlgorithm.name).toBe('Heapsort');
//         });
//     });

//     test('loads Binary Search Tree algorithm when URL is /?alg=binarySearchTree&mode=search', async () => {
//         renderWithContext(<App />, { route: '/?alg=binarySearchTree&mode=search' });

//         // Check if the global state is updated to Binary Search Tree
//         await waitFor(() => {
//             const algorithmKey = Object.keys(algorithms).find(
//                 key => algorithms[key].name === 'Binary Search Tree'
//             );
//             expect(algorithmKey).toBeDefined();
//             const globalStateAlgorithm = algorithms[algorithmKey];
//             expect(globalStateAlgorithm.name).toBe('Binary Search Tree');
//         });
//     });

//     test('displays error when invalid URL parameters are provided', async () => {
//         renderWithContext(<App />, { route: '/?alg=nonExistent&mode=unknown' });

//         // Check if error message is displayed when algorithm is invalid
//         await waitFor(() => {
//             const footer = document.getElementById('footer');
//             expect(footer).toHaveTextContent('Invalid algorithm specified');
//         });
//     });
// });



// // src/algorithms/parameters/helpers/urlHelpers.test.js

// import React, { useContext } from 'react';
// import { render, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import '@testing-library/jest-dom/extend-expect';
// import App from '../../../App';
// import { GlobalContext, GlobalProvider } from '../../../context/GlobalState';
// import { URLProvider } from '../../../context/urlState';

// // A helper component to access the current global state
// const GlobalStateChecker = ({ onStateChange }) => {
//     const globalState = useContext(GlobalContext);

//     // Call the onStateChange callback whenever the component renders
//     React.useEffect(() => {
//         onStateChange(globalState);
//     }, [globalState, onStateChange]);

//     return null;
// };

// // Custom render function that includes GlobalProvider, URLProvider, and state inspection
// const renderWithContextAndStateChecker = (ui, { route = '/', onStateChange } = {}) => {
//     return render(
//         <MemoryRouter initialEntries={[route]}>
//             <GlobalProvider>
//                 <URLProvider>
//                     <GlobalStateChecker onStateChange={onStateChange} />
//                     {ui}
//                 </URLProvider>
//             </GlobalProvider>
//         </MemoryRouter>
//     );
// };

// describe('GlobalState and URL synchronization Tests', () => {
//     test('updates global state to Binary Search Tree algorithm when URL is /?alg=binarySearchTree&mode=search', async () => {
//         let observedState = null;

//         renderWithContextAndStateChecker(<App />, {
//             route: '/?alg=binarySearchTree&mode=search',
//             onStateChange: (state) => {
//                 observedState = state;
//             },
//         });

//         // Wait until the global state reflects the desired algorithm
//         await waitFor(() => {
//             expect(observedState).not.toBeNull();
//             expect(observedState.algorithm).not.toBeNull();
//             expect(observedState.algorithm.name).toBe('Binary Search Tree');
//             expect(observedState.mode).toBe('search');
//         });
//     });

//     test('sets error state when invalid URL parameters are provided', async () => {
//         let observedState = null;

//         renderWithContextAndStateChecker(<App />, {
//             route: '/?alg=nonExistent&mode=unknown',
//             onStateChange: (state) => {
//                 observedState = state;
//             },
//         });

//         // Wait until the global state reflects an error for invalid algorithm
//         await waitFor(() => {
//             expect(observedState).not.toBeNull();
//             expect(observedState.error).toBe('Invalid algorithm specified');
//         });
//     });
// }); // Receives Heapsort.


// // src/algorithms/parameters/helpers/urlHelpers.test.js

// import React, { useContext } from 'react';
// import { render, waitFor, cleanup } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import '@testing-library/jest-dom/extend-expect';
// import App from '../../../App';
// import { GlobalProvider, GlobalContext } from '../../../context/GlobalState';
// import { URLProvider } from '../../../context/urlState';

// // Helper component to observe global state directly
// const GlobalStateObserver = ({ onStateChange }) => {
//     const globalState = useContext(GlobalContext);

//     React.useEffect(() => {
//         onStateChange(globalState);
//     }, [globalState, onStateChange]);

//     return null;
// };

// // Utility to set window location
// const setWindowLocation = (url) => {
//     delete window.location;
//     window.location = new URL(url);
// };

// // Custom render function that includes GlobalProvider, URLProvider, and state observation
// const renderWithProviders = (ui, { route = '/', onStateChange } = {}) => {
//     return render(
//         <MemoryRouter initialEntries={[route]}>
//             <GlobalProvider>
//                 <URLProvider>
//                     <GlobalStateObserver onStateChange={onStateChange} />
//                     {ui}
//                 </URLProvider>
//             </GlobalProvider>
//         </MemoryRouter>
//     );
// };

// describe('Global State and URL synchronization Tests', () => {
//     afterEach(() => {
//         cleanup();
//         setWindowLocation('http://localhost/'); // Reset after each test
//     });

//     test('updates global state to Binary Search Tree algorithm when URL is /?alg=binarySearchTree&mode=search', async () => {
//         setWindowLocation('http://localhost/?alg=binarySearchTree&mode=search');
//         let observedState = null;

//         renderWithProviders(<App />, {
//             onStateChange: (state) => {
//                 observedState = state;
//             },
//         });

//         await waitFor(() => {
//             expect(observedState).not.toBeNull();
//             expect(observedState.algorithm.name).toBe('Binary Search Tree');
//             expect(observedState.mode).toBe('search');
//         });
//     });

//     test('falls back to default algorithm when invalid URL parameters are provided', async () => {
//         setWindowLocation('http://localhost/?alg=nonExistent&mode=unknown');
//         let observedState = null;

//         renderWithProviders(<App />, {
//             onStateChange: (state) => {
//                 observedState = state;
//             },
//         });

//         await waitFor(() => {
//             expect(observedState).not.toBeNull();
//             expect(observedState.algorithm.name).toBe('Heapsort');
//             expect(observedState.mode).toBe('sort');
//         });
//     });
// }); // Heapsort only.


// // Import necessary dependencies
// import React, { useContext } from 'react';
// import { render, waitFor } from '@testing-library/react';
// import { MemoryRouter, Route } from 'react-router-dom';
// import '@testing-library/jest-dom/extend-expect';
// import Router from '../../../router/Router'; // Adjusted path based on `Router` being in `src/`
// import { GlobalProvider, GlobalContext } from '../../../context/GlobalState';

// // Helper component to observe global state directly
// const GlobalStateObserver = ({ onStateChange }) => {
//     const globalState = useContext(GlobalContext);

//     React.useEffect(() => {
//         onStateChange(globalState);
//     }, [globalState, onStateChange]);

//     return null;
// };

// // Testing utility with MemoryRouter
// const renderWithRouter = (initialPath, onStateChange) => {
//     return render(
//         <MemoryRouter initialEntries={[initialPath]}>
//             <GlobalProvider>
//                 <GlobalStateObserver onStateChange={onStateChange} />
//                 <Router />
//             </GlobalProvider>
//         </MemoryRouter>
//     );
// };

// describe('Router with query parameters', () => {
//     test('loads App with Binary Search Tree algorithm when URL is /?alg=binarySearchTree&mode=search', async () => {
//         let observedState = null;

//         renderWithRouter('/?alg=binarySearchTree&mode=search', (state) => {
//             observedState = state;
//         });

//         await waitFor(() => {
//             expect(observedState).not.toBeNull();
//             expect(observedState.algorithm.name).toBe('Binary Search Tree');
//             expect(observedState.mode).toBe('search');
//         });
//     });

//     test('loads App with default algorithm when URL has invalid parameters', async () => {
//         let observedState = null;

//         renderWithRouter('/?alg=invalidAlgorithm&mode=unknown', (state) => {
//             observedState = state;
//         });

//         await waitFor(() => {
//             expect(observedState).not.toBeNull();
//             expect(observedState.algorithm.name).toBe('Heapsort'); // Assuming 'Heapsort' is the default
//             expect(observedState.mode).toBe('sort');
//         });
//     });
// }); // Heapsort only.



// import React, { useContext, useEffect } from 'react';
// import { render, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import Router from '../../../router/Router'; // Adjust path as necessary
// import { GlobalProvider, GlobalContext } from '../../../context/GlobalState';
// import { URLProvider } from '../../../context/urlState';
// import '@testing-library/jest-dom/extend-expect';

// // Helper component to observe GlobalState directly
// const GlobalStateObserver = ({ onStateChange }) => {
//     const globalState = useContext(GlobalContext);
//     useEffect(() => {
//         onStateChange(globalState);
//     }, [globalState]);
//     return null;
// };

// const renderWithProviders = (ui, { route = '/' } = {}) => {
//     const globalStateObserver = jest.fn();
//     return {
//         ...render(
//             <MemoryRouter initialEntries={[route]}>
//                 <GlobalProvider>
//                     <URLProvider>
//                         {ui}
//                         <GlobalStateObserver onStateChange={globalStateObserver} />
//                     </URLProvider>
//                 </GlobalProvider>
//             </MemoryRouter>
//         ),
//         globalStateObserver,
//     };
// };

// describe('URL to GlobalState Sync Tests', () => {
//     test('loads specified algorithm and mode from URL', async () => {
//         const route = '/?alg=binarySearchTree&mode=search';

//         const { globalStateObserver } = renderWithProviders(<Router />, { route });

//         await waitFor(() => {
//             // Check that GlobalState was updated with the URL parameters
//             expect(globalStateObserver).toHaveBeenCalledWith(
//                 expect.objectContaining({
//                     algorithm: expect.objectContaining({
//                         name: 'Binary Search Tree',
//                     }),
//                     mode: 'search',
//                 })
//             );
//         });
//     });

//     test('falls back to default values when URL parameters are invalid', async () => {
//         const route = '/?alg=nonExistent&mode=unknown';

//         const { globalStateObserver } = renderWithProviders(<Router />, { route });

//         await waitFor(() => {
//             // Check that default algorithm and mode are loaded
//             expect(globalStateObserver).toHaveBeenCalledWith(
//                 expect.objectContaining({
//                     algorithm: expect.objectContaining({
//                         name: 'Heapsort',
//                     }),
//                     mode: 'sort',
//                 })
//             );
//         });
//     });

//     test('correctly loads parameters for a sorting algorithm', async () => {
//         const route = '/?alg=heapSort&mode=sort&list=1,2,3';

//         const { globalStateObserver } = renderWithProviders(<Router />, { route });

//         await waitFor(() => {
//             expect(globalStateObserver).toHaveBeenCalledWith(
//                 expect.objectContaining({
//                     algorithm: expect.objectContaining({
//                         name: 'Heapsort',
//                     }),
//                     mode: 'sort',
//                     parameters: expect.objectContaining({
//                         list: '1,2,3',
//                     }),
//                 })
//             );
//         });
//     });
// });



// import { renderHook, act } from '@testing-library/react-hooks';
// import { useUrlParams } from '../../../algorithms/parameters/helpers/urlHelpers';

// // Helper function to change the URL
// const setMockUrl = (url) => {
//     window.history.pushState({}, 'Test page', url);
// };

// describe('useUrlParams', () => {
//     it('should return default values when no parameters are provided', () => {
//         setMockUrl('/');

//         const { result } = renderHook(() => useUrlParams());

//         expect(result.current).toEqual({
//             alg: 'heapSort',
//             mode: 'sort',
//             list: '',
//             value: '',
//             xyCoords: '',
//             edgeWeights: '',
//             size: '',
//             start: '',
//             end: '',
//             string: '',
//             pattern: '',
//             union: '',
//             heuristic: '',
//             min: '',
//             max: '',
//         });
//     });

//     it('should parse valid URL parameters', () => {
//         setMockUrl('/?alg=binarySearchTree&mode=search&list=1,2,3&value=5&xyCoords=1-1,2-2&edgeWeights=1-2-3');

//         const { result } = renderHook(() => useUrlParams());

//         expect(result.current).toEqual({
//             alg: 'binarySearchTree',
//             mode: 'search',
//             list: '1,2,3',
//             value: '5',
//             xyCoords: '1-1,2-2',
//             edgeWeights: '1-2-3',
//             size: '',
//             start: '',
//             end: '',
//             string: '',
//             pattern: '',
//             union: '',
//             heuristic: '',
//             min: '',
//             max: '',
//         });
//     });

//     it('should handle invalid parameters gracefully and fall back to defaults', () => {
//         setMockUrl('/?alg=nonExistentAlg&mode=unknownMode');

//         const { result } = renderHook(() => useUrlParams());

//         expect(result.current.alg).toBe('heapSort'); // Default algorithm
//         expect(result.current.mode).toBe('sort');    // Default mode
//     });

//     it('should update parameters when URL changes', () => {
//         const { result, rerender } = renderHook(() => useUrlParams());

//         // Set initial URL
//         act(() => {
//             setMockUrl('/?alg=quickSort&mode=sort&list=9,8,7');
//             rerender();
//         });

//         expect(result.current).toEqual({
//             alg: 'quickSort',
//             mode: 'sort',
//             list: '9,8,7',
//             value: '',
//             xyCoords: '',
//             edgeWeights: '',
//             size: '',
//             start: '',
//             end: '',
//             string: '',
//             pattern: '',
//             union: '',
//             heuristic: '',
//             min: '',
//             max: '',
//         });

//         // Change URL again
//         act(() => {
//             setMockUrl('/?alg=DFS&mode=find&size=10&start=1&end=5');
//             rerender();
//         });

//         expect(result.current).toEqual({
//             alg: 'DFS',
//             mode: 'find',
//             list: '',
//             value: '',
//             xyCoords: '',
//             edgeWeights: '',
//             size: '10',
//             start: '1',
//             end: '5',
//             string: '',
//             pattern: '',
//             union: '',
//             heuristic: '',
//             min: '',
//             max: '',
//         });
//     });
// });

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
    it('should return default values when no parameters are provided', () => {
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

    it('should handle invalid parameters gracefully and fall back to defaults', () => {
        setMockUrl('/?alg=nonExistentAlg&mode=unknownMode');

        const { result } = renderHook(() => useUrlParams());

        expect(result.current.alg).toBe('heapSort'); // Default algorithm
        expect(result.current.mode).toBe('sort');    // Default mode
    });

    it('should update parameters when URL changes', () => {
        const { result, rerender } = renderHook(() => useUrlParams());

        // Set initial URL
        act(() => {
            setMockUrl('/?alg=quickSort&mode=sort&list=9,8,7');
            rerender();
        });

        expect(result.current).toEqual({
            alg: 'quickSort',
            mode: 'sort',
            list: '9,8,7',
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

        // Change URL again
        act(() => {
            setMockUrl('/?alg=DFS&mode=find&size=10&start=1&end=5');
            rerender();
        });

        expect(result.current).toEqual({
            alg: 'DFS',
            mode: 'find',
            list: '',
            value: '',
            xyCoords: '',
            edgeWeights: '',
            size: '10',
            start: '1',
            end: '5',
            string: '',
            pattern: '',
            union: '',
            heuristic: '',
            min: '',
            max: '',
        });
    });
});
