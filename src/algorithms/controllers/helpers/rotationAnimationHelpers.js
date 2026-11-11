// This file contains any operations or functions that concerns rotations and animations

import { moveRotationPair } from './treeOperationHelpers';

export function getRotationBookmarks(direction) {
    return direction === 'right'
        ? {
            enter: 'rightRotate(t6)',
            identifyNewRoot: 't2 = left(t6)',
            identifyTransfer: 't4 = right(t2)',
            linkPivot: 't2.right = t6',
            linkTransfer: 't6.left = t4',
            returnRoot: 'return t2',
        }
        : {
            enter: 'leftRotate(t2)',
            identifyNewRoot: 't6 = right(t2)',
            identifyTransfer: 't4 = left(t6)',
            linkPivot: 't6.left = t2',
            linkTransfer: 't2.right = t4',
            returnRoot: 'return t6',
        };
}

export function startRotationMovement(graph, pivotKey, newRootKey, extraPositions = {}) {
    const pivot = graph.findNode(pivotKey);
    const child = graph.findNode(newRootKey);

    graph.setRotPos({
        rX: pivot.x,
        rY: pivot.y,
        cX: child.x,
        cY: child.y,
        ...extraPositions,
    });

    moveRotationPair(graph, pivotKey, newRootKey, 1);
}

export function advanceRotationMovement(graph, pivotKey, newRootKey, { pauseLayout = false, resize = false } = {}) {
    if (pauseLayout) {
        graph.setPauseLayout(true);
    }

    moveRotationPair(graph, pivotKey, newRootKey, 2);

    if (resize) {
        graph.rectangle_size();
    }
}

export function detachRotationEdges(graph, pivotKey, newRootKey, transferredSubtreeKey) {
    graph.removeEdge(pivotKey, newRootKey);

    if (transferredSubtreeKey !== null) {
        graph.removeEdge(newRootKey, transferredSubtreeKey);
    }
}

export function attachRotationTransfer(graph, pivotKey, transferredSubtreeKey, edgeColour) {
    if (transferredSubtreeKey !== null) {
        graph.addEdge(pivotKey, transferredSubtreeKey);

        if (edgeColour !== undefined) {
            graph.setEdgeColor(pivotKey, transferredSubtreeKey, edgeColour);
        }
    }
}

export function reconnectRotationParent(graph, parentKey, pivotKey, newRootKey) {
    if (parentKey !== null) {
        graph.removeEdge(parentKey, pivotKey);
        graph.addEdge(parentKey, newRootKey);
    }
}

export function finishRotationLayout(graph, rootKey, ...layoutOptions) {
    graph.setMoveRatio(3 / 6);
    graph.setPauseLayout(false);
    graph.layoutAVL(rootKey, true, ...layoutOptions);
}
