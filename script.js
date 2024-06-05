import { highlightEdge, highlightNeighbor, clearHighlightedNeighbors, updateVertexDistance, clearGraph } from './view.js';
import { graph } from './model.js';

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
    let visited = new Set();
    let vertices = Object.keys(graph);

    vertices.forEach(vertex => {
        distances[vertex] = Infinity;
    });

    distances[start] = 0;

    while (vertices.length) {
        vertices.sort((a, b) => distances[a] - distances[b]);
        console.log(vertices)
        let closestVertex = vertices.shift();
        if (distances[closestVertex] === Infinity) break;

        clearHighlightedNeighbors();

        visited.add(closestVertex);
        await updateVertexDistance(closestVertex, distances[closestVertex], delay);

        for (let neighbor in graph[closestVertex]) {
            if (!visited.has(neighbor)) {
                highlightNeighbor(closestVertex, neighbor);
                await sleep(delay);
                let newDistance = distances[closestVertex] + graph[closestVertex][neighbor];
                await sleep(delay);
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    previous[neighbor] = closestVertex;
                    await updateVertexDistance(neighbor, newDistance, delay);
                }
            }
        }
    }
    findShortestPath(end, previous, visited, start);
}

async function findShortestPath(end, previous, visited, start) {
    let path = [];
    let pathVertex = end;
    let pathSet = new Set();
    let totalDistance = 0;
    let pathDetails = [];

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

    let pathString = `Shortest path: ${start} -> ${pathDetails.join(' -> ')}, total: ${totalDistance}`;
    document.getElementById('result').innerText = pathString;

    visited.forEach(vertex => {
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
