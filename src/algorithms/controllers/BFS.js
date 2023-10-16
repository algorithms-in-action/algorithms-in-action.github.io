import GraphTracer from '../../components/DataStructures/Graph/GraphTracer';
import Array2DTracer from '../../components/DataStructures/Array/Array2DTracer';

export default {
  initVisualisers() {
    return {
      graph: {
        instance: new GraphTracer('graph', null, 'Graph view'),
        order: 0,
      },
      array: {
        instance: new Array2DTracer('array', null, 'Queue & Visited'),
        order: 1,
      },
    };
  },


  run(chunker, { matrix, endNode}){
    const algNameStr = 'BFS';
    const E = [...matrix]; // Initialize the adjacency matrix (matrix) as E
    const numVertices = matrix.length; // Initialize the number of vertices as numVertices
    const visited = new Array(numVertices).fill(false); // Initialize an array "Seen" to keep track of visited vertices, initially all set to false
    const displayedVisited = new Array(numVertices);
    const nodes = [];
    const parents = [];
    const noParent = "-"; 

    // Initialize all elements in displayedVisited to false
    displayedVisited[0] = "Visited";
    for (let i = 1; i < numVertices+1; i++) {
      displayedVisited[i] = "False";
    }

    //Initialize all elements in Nodes to its corresponding nodes in the graph display
    nodes[0] = "Nodes";
    for (let i = 1; i < numVertices+1; i++) {
      nodes[i] = i;
    }

    //Initialize all parents to 0 
    parents[0] = "parents"
    for (let i = 1; i < numVertices+1; i++) {
      parents[i] = 0;
    }

    chunker.add(
      1,
      (vis, array) => {
        vis.graph.directed(false);
        vis.graph.weighted(false);
        vis.graph.set(array, Array.from({ length: matrix.length }, (v, k) => (k + 1)));
      },
      [E]
    );

    const bfs = (startVertex) => { // Define the BFS function
      const queue = []; // Initialize a queue
      queue.push(startVertex); // Enqueue the starting vertex s
      visited[startVertex] = true; // Set Seen[s] = True
      displayedVisited[startVertex+1] = "True";
      const green = 1;
      const orange = 2;
      const red = 3;

      // Initialize all display array and queue
      chunker.add(
        6,
        (vis, v) => {
          vis.array.set(v, algNameStr);
          vis.array.setList(queue);
        },
        [[nodes,parents, displayedVisited], 0]
      );

      while (queue.length > 0) { // While the queue is not empty
        const currentVertex = queue.shift(); // Dequeue a vertex n
        parents[startVertex+1] = noParent;
        // Check if n is an end node (this is not explicitly mentioned in the pseudocode)

        for (let i = 0; i < numVertices; i++) { // For each node m in neighboring n

          //Highlight current node
          chunker.add(
            4,
            (vis,graph) => {
              vis.graph.colorNode(currentVertex, green);
            },
            [E]
          )

          if (E[currentVertex][i] === 1 && !visited[i]) { // If m is not Seen and there is an edge from n to m
            
            // Highlight all the edges between unvisited neighbours and current node
            chunker.add(
              4,
              (vis,graph, x) => {
                vis.graph.colorEdge(x, i, orange);
              },
              [E, currentVertex]
            )

            queue.push(i); // Enqueue m
            visited[i] = true; // Set Seen[m] = True
            displayedVisited[i+1] = "True";
            parents[i + 1] = currentVertex+1;
            // Parent[m] <- n (not explicitly implemented in this code, but you can track the parent if needed)

            //Display array with new value as some nodes are already visited by now and has its parent.
            chunker.add(
              8,
              (vis, v) => {
                vis.array.set(v, algNameStr);
                vis.array.setList(queue);
              },
              [[nodes,parents,displayedVisited], 0]
            );

          }

          //Remove the edge highlight after visiting 1 node
          if(i == numVertices-1){
            for(let i = 0; i < numVertices; i++){
              chunker.add(
                4,
                (vis,graph, x) => {
                  vis.graph.removeEdgeColor(x, i);
                },
                [E, currentVertex]
              )
            }
          }
          
        }
      }
    };

    for (let i = 0; i < numVertices; i++) { // For each vertex v
      if (!visited[i]) { // If v is not Seen
        bfs(i); // Call BFS starting from v
      }
    }
  }
};