export function calculateRotationStep(originalPos, step) {
    const { rX, rY, cX, cY } = originalPos;

    const deltaX = rX - cX;
    const deltaY = rY - cY;

    const pos = { rX: 0, rY: 0, cX: 0, cY: 0 };

    let horizontalSeparation;

    if (step === 1) {
        pos.rY = (2 * rY + cY) / 3;
        pos.cY = (rY + cY) / 2;

        horizontalSeparation = Math.sqrt(
            (35 / 36) * deltaY ** 2 + deltaX ** 2
        );
    } else if (step === 2) {
        pos.rY = (rY + 2 * cY) / 3;
        pos.cY = rY;

        horizontalSeparation = Math.sqrt(
            (5 / 9) * deltaY ** 2 + deltaX ** 2
        );
    } else {
        throw new RangeError(`Unsupported rotation step: ${step}`);
    }

    if (rX > cX) {
        horizontalSeparation = -horizontalSeparation;
    }

    pos.rX = (0.6 * rX + 0.4 * cX) - 0.4 * horizontalSeparation;
    pos.cX = (0.6 * rX + 0.4 * cX) + 0.6 * horizontalSeparation;

    return pos;
}

export function clearTreeHighlights(graph) {
    graph.nodes.forEach(({ id }) => {
        graph.setNodeColor(id, undefined);
    });

    graph.edges.forEach(({ source, target }) => {
        graph.setEdgeColor(source, target, undefined);
    });
}

export function highlightTreePath(graph, nodeKeys, colours) {
    nodeKeys.forEach((nodeKey, index) => {
        graph.setNodeColor(nodeKey, colours.node);

        if (index > 0) {
            graph.setEdgeColor(
                nodeKeys[index - 1],
                nodeKey,
                colours.edge
            );
        }
    });
}

export function moveRotationPair(graph, pivotKey, childKey, step) {
    const originalPos = graph.getRotPos();
    const pos = calculateRotationStep(originalPos, step);

    graph.setNodePosition(pivotKey, pos.rX, pos.rY);
    graph.setNodePosition(childKey, pos.cX, pos.cY);
}

export function centerRotatedRoot(graph, newRootKey) {
    const originalPos = graph.getRotPos();
    const pos = calculateRotationStep(originalPos, 2);

    const x = (originalPos.rX + 3 * originalPos.cX) / 4;

    graph.setNodePosition(newRootKey, x, pos.cY);
}

export function lowerRotatedPivot(graph, pivotKey) {
    const originalPos = graph.getRotPos();
    const pos = calculateRotationStep(originalPos, 2);

    const deltaY = (pos.rY - originalPos.rY) / 3;

    graph.setNodePosition(pivotKey, pos.rX, pos.rY + deltaY);

    return deltaY;
}

export function showTreeOperation(graph, operation, key) {
    const label = operation === 'search' ? 'Search' : operation === 'delete' ? 'Delete' : 'Insert';

    graph.setFunctionName(`${label}: ${key}`);
}

export function pushTreeDepthBox(graph, nodeKeys, depth, resize = false) {
    graph.pushRectStack(nodeKeys, `Depth ${depth}`);

    if (resize) {
        graph.rectangle_size();
    }
}

export function trimTreeDepthBoxes(graph, depth) {
    while (graph.rectangles && graph.rectangles.length > depth) {
        graph.popRectStack();
    }
}

export function clearTreePointerLabels(graph, clearTag = false) {
    if (graph.clearTID) {
        graph.clearTID();
    }

    if (clearTag && graph.setTagInfo) {
        graph.setTagInfo('');
    }
}
