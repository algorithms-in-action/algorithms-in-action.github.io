import React from 'react';
import '../../styles/GraphAlgorithms.scss'; 

const graphAlgorithms = [
  { name: 'Depth First Search', url: 'http://localhost:3000/' },
  { name: 'DFS (iterative)', url: 'http://localhost:3000/' },
  { name: 'Breadth First Search', url: 'http://localhost:3000/' },
  { name: "Dijkstra's (shortest path)", url: 'http://localhost:3000/' },
  { name: 'A* (heuristic search)', url: 'http://localhost:3000/' },
  { name: "Prim's (min. spanning tree)", url: 'http://localhost:3000/' },
  { name: "Prim's (simpler code)", url: 'http://localhost:3000/' },
  { name: "Kruskal's (min. spanning tree)", url: 'http://localhost:3000/' },
  { name: "Warshall's (transitive closure)", url: 'http://localhost:3000/' }
];

const GraphAlgorithms = () => {
  return (
    <div className="graph-container">
      <h2 className="category">Graph</h2>
      {graphAlgorithms.map((algorithm, index) => (
        <a key={index} href={algorithm.url} className="graph-link">
          {algorithm.name}
        </a>
      ))}
    </div>
  );
};

export default GraphAlgorithms;