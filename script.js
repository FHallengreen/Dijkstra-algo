import { highlightEdge, highlightNeighbor, clearHighlightedEdges, updateVertexDistance, clearGraph } from './view.js';
import { graph, PriorityQueue } from './model.js';

console.log("script running");

let startVertex = null;
let endVertex = null;

document.querySelectorAll('circle').forEach(circle => {
    circle.addEventListener('click', () => {
        const vertexId = circle.id.replace('vertex', '');
        if (!startVertex) {
            startVertex = vertexId;
            document.getElementById('start-end').innerText = `Start: ${startVertex}, End: N/A`;
        } else if (!endVertex) {
            endVertex = vertexId;
            document.getElementById('start-end').innerText = `Start: ${startVertex}, End: ${endVertex}`;
        }
    });
});

async function dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    let visited = new Set();

    Object.keys(graph).forEach(vertex => {
        distances[vertex] = Infinity;
        previous[vertex] = null;
    });

    distances[start] = 0;
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
        const { vertex: closestVertex } = pq.dequeue();

        console.log(`Processing vertex: ${closestVertex}, Distance: ${distances[closestVertex]}`);
        console.log(`Priority queue state:`, pq.queue);

        if (closestVertex === end) break;

        if (distances[closestVertex] === Infinity) break;

        clearHighlightedEdges();

        visited.add(closestVertex);
        await updateVertexDistance(closestVertex, distances[closestVertex], previous[closestVertex], delay);

        for (let neighbor in graph[closestVertex]) {
            if (!visited.has(neighbor)) {
                highlightNeighbor(closestVertex, neighbor);
                await sleep(delay);
                let newDistance = distances[closestVertex] + graph[closestVertex][neighbor];
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    previous[neighbor] = closestVertex;
                    pq.enqueue(neighbor, newDistance);
                    await updateVertexDistance(neighbor, newDistance, closestVertex, delay);
                }
            }
        }
    }
    await findShortestPath(end, previous, start);
}

async function findShortestPath(end, previous, start) {
    let path = [];
    let pathVertex = end;
    let pathSet = new Set();
    let totalDistance = 0;
    let pathDetails = [];

    clearHighlightedEdges();

    while (pathVertex) {
        path.push(pathVertex);
        pathSet.add(pathVertex);
        if (previous[pathVertex]) {
            let distance = graph[previous[pathVertex]][pathVertex];
            pathDetails.push(`${pathVertex}(${distance})`);
            totalDistance += distance;
            await highlightEdge(pathVertex, previous[pathVertex], 'green', delay);
        }
        pathVertex = previous[pathVertex];
    }
    path.reverse();
    pathDetails.reverse();

    let pathString = `Shortest path: ${start} -> ${pathDetails.join(' -> ')}, Total: ${totalDistance}`;
    document.getElementById('result').innerText = pathString;

    Object.keys(graph).forEach(async vertex => {
        if (!pathSet.has(vertex)) {
            document.getElementById(`vertex${vertex}`).style.fill = '#ff5151';
        }
    });
}

export let delay = 1000;
document.getElementById("ms").innerHTML = `${delay} ms`;

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('run').addEventListener('click', runAnimation);
document.getElementById('reset').addEventListener('click', resetGraph);

async function runAnimation() {
    if (!startVertex || !endVertex) {
        alert("Please select both start and end vertices.");
        return;
    }
    await dijkstra(startVertex, endVertex);
}

function resetGraph() {
    startVertex = null;
    endVertex = null;
    clearGraph();
}

document.getElementById('delayRange').addEventListener('input', function (event) {
    delay = parseInt(event.target.value);
    document.getElementById("ms").innerHTML = `${delay} ms`;
});
