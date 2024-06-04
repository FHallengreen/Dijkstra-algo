import { sleep } from './script.js';

export async function highlightEdge(vertex1, vertex2, color, delay) {
    const reverseEdgeId = `edge${vertex2}${vertex1}`;
    const edgeId = `edge${vertex1}${vertex2}`;
    const edge = document.getElementById(edgeId) || document.getElementById(reverseEdgeId);
    if (edge) {
        edge.style.stroke = color;
        edge.style.strokeWidth = 5;
        await sleep(delay);
    }
    else {
        console.error(`Edge not found: ${edgeId} or ${reverseEdgeId}`);
    }
}

export function highlightNeighbor(vertex, neighbor) {
    const lineId1 = `edge${vertex}${neighbor}`;
    const lineId2 = `edge${neighbor}${vertex}`;
    const line = document.getElementById(lineId1) || document.getElementById(lineId2);
    if (line) {
        line.style.stroke = '#ff5151';
        line.style.strokeWidth = 3;
    } else {
        console.error(`Edge not found: ${lineId1} or ${lineId2}`);
    }
}


export function clearHighlightedNeighbors() {
    document.querySelectorAll('line').forEach(line => {
        line.style.stroke = '#000';
        line.style.strokeWidth = 1;
    });
}

export function clearGraph() {
    document.getElementById('start-end').innerText = 'Start: N/A, End: N/A';
    document.getElementById('result').innerText = 'Shortest path: ';

    document.querySelectorAll('svg text[id^="distance"]').forEach(text => text.innerHTML = '∞');

    document.querySelectorAll('circle').forEach(circle => circle.style.fill = '#ff5151');

    document.querySelectorAll('line').forEach(line => {
        line.style.stroke = '#000';
        line.style.strokeWidth = '1';
    });

    document.querySelectorAll('td[id^="tableDistance"]').forEach(value => {
        value.innerText = '∞';
    });
}



export async function updateVertexDistance(vertex, distance, delay) {   
    const distanceText = distance === Infinity ? '∞' : distance;
    document.getElementById('distance' + vertex).textContent = distanceText;
    document.getElementById('tableDistance' + vertex).textContent = distanceText;
    if (distance !== Infinity) {
        document.getElementById(`vertex${vertex}`).setAttribute("style", "fill: #88bb88");
    }
    await sleep(delay);
}


