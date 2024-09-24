import React from 'react';
import '../../styles/GraphAlgorithms.scss'; 

// Get the base URL dynamically
const baseUrl = window.location.origin;

const graphAlgorithms = [
  { name: 'Depth First Search', url: `${baseUrl}/?alg=DFSrec&mode=find` },
  { name: 'DFS (iterative)', url: `${baseUrl}/?alg=DFS&mode=find` },
  { name: 'Breadth First Search', url: `${baseUrl}/?alg=BFS&mode=find` },
  { name: "Dijkstra's (shortest path)", url: `${baseUrl}/?alg=dijkstra&mode=find` },
  { name: 'A* (heuristic search)', url: `${baseUrl}/?alg=aStar&mode=find` },
  { name: "Prim's (min. spanning tree)", url: `${baseUrl}/?alg=prim&mode=find` },
  { name: "Prim's (simpler code)", url: `${baseUrl}/?alg=prim_old&mode=find` },
  { name: "Kruskal's (min. spanning tree)", url: `${baseUrl}/?alg=kruskal&mode=find` },
  { name: "Warshall's (transitive closure)", url: `${baseUrl}/?alg=transitiveClosure&mode=tc` }
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