# Dijkstra's Algorithm

Dijkstra's algorithm (/ˈdaɪkstrəz/ DYKE-strəz) is a fundamental concept in computer science and graph theory that helps find the shortest path between two points in a weighted graph. It's commonly used in various applications like finding the shortest route on a map or optimizing network communication paths. 
 
## In simpler terms:

Imagine you have a map with different cities (nodes) connected by roads (edges), and each road has a distance (weight) associated with it. You want to find the shortest path from one city (start node) to another city (destination node). Dijkstra's algorithm helps you find this shortest path by considering the distances between cities.

## Here's how the algorithm works:

1. **Initialization**: You start at the chosen starting city. Initially, you mark its distance as 0, indicating that you're at the starting point. The distances to all other cities are marked as infinity (or a very large value) to indicate that they are currently unreachable.

2. **Exploration**: You explore the cities around the current city. You examine all the neighboring cities that are connected directly by roads (edges) to the current city.

3. Update Distances: For each neighboring city, you calculate the total distance to reach that city from the starting city via the current city's path. If this calculated distance is shorter than the previously recorded distance, you update the recorded distance for that city.

4. Move to Next City: After updating the distances for neighboring cities, you move to the city with the shortest recorded distance among the unvisited cities. This city becomes the new "current city."

5. Repeat: You continue this process of exploring neighbors, updating distances, and moving to the next city until you reach the destination city or until all cities have been visited.

6. Backtracking (Optional): Once you reach the destination city, you can backtrack from the destination to the starting city using the recorded distances to determine the shortest path you took to get there.

The algorithm guarantees that once you've marked a city as visited and recorded its distance, the recorded distance is indeed the shortest distance from the starting city to that city. This is because the algorithm is designed to always choose the shortest available path at each step.

Dijkstra's algorithm works best when all edge weights are non-negative. If there are negative weights, the algorithm might not work as expected, and you might need to use other algorithms like the Bellman-Ford algorithm.

## TLDR

Dijkstra's algorithm is like finding the shortest route on a map while considering the distances between cities and the roads connecting them. It's a powerful tool for solving various optimization problems in real-world scenarios.
