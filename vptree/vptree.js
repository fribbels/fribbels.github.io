class VPNode {
    constructor(elems, parent) {
        var vp = elems[Math.floor(Math.random()*elems.length)];
        // var vp = elems[0];
        var distances = new Array(elems.length);
        var leftList = [];
        var rightList = [];


        for (var i = 0; i < elems.length; i++) {
            distances[i] = vp.dist(elems[i]);
        }

        var mu = select(distances, Math.floor(distances.length/2));

        this.elems = elems;
        this.vp = vp;
        this.mu = mu;
        this.parent = parent;

        for (var i = 0; i < elems.length; i++) {
            if (vp.dist(elems[i]) < mu)
                leftList.push(elems[i]);
            else
                rightList.push(elems[i]);
        }

        if (leftList.length != 0 && rightList.length != 0) {
            this.left = new VPNode(leftList, this);
            this.right = new VPNode(rightList, this);
        }
    }
}

class Data {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    dist(other) {
        var a = this.x-other.x;
        var b = this.y-other.y;
        return Math.sqrt(a*a + b*b); 
    }
}

class Timer {
    constructor() {
        this.start = window.performance.now();
    }

    tick() {
        var end = window.performance.now();
        return end - this.start;
    }
}

class DistanceQueue {
    constructor(query, n) {
        this.query = query;
        this.arr = new Array(n);
        this.distances = new Array(n);
        this.n = n;
    }

    all() {
        return this.arr;
    }

    last() {
        for (var i = this.n-1; i >= 0; i--) {
            if (this.arr[i] != undefined)
                return this.arr[i];
        }

        return undefined;
    }

    push(elem) {
        var dist = this.query.dist(elem);
        var i;
        var tempDist;
        var tempElem;
        for (i = 0; i < this.n; i++) {
            if (this.distances[i] == undefined || dist < this.distances[i]) {
                tempDist = this.distances[i];
                tempElem = this.arr[i];
                this.distances[i] = dist;
                this.arr[i] = elem;
                break;
            }
        }

        var j;
        for (j = i+1; j < this.n; j++) {
            if (this.arr[j] == undefined) {
                this.arr[j] = tempElem;
                this.distances[j] = tempDist;
                break;
            }
            var tD = this.distances[j];
            var tE = this.arr[j];
            this.distances[j] = tempDist;
            this.arr[j] = tempElem;
            tempDist = tD;
            tempElem = tE;
        }
    }
}

function knn (root, k, query) {
    var count = 0;
    var trash = 0;
    var tau = Infinity;
    var nodesToVisit = [root];

    var distanceQueue = new DistanceQueue(query, k);

    while(nodesToVisit.length > 0) {
        var currentNode = nodesToVisit.splice(0, 1)[0]; // Remove first element
        if (currentNode == undefined) {
            trash++;
            continue;
        }

        count++;
        var dist = query.dist(currentNode.vp);

        if (dist < tau) {

            distanceQueue.push(currentNode.vp);
            var farthest = distanceQueue.last();
            tau = query.dist(farthest);
        }

        if (dist < currentNode.mu) {
            if (dist < currentNode.mu + tau) 
                nodesToVisit.push(currentNode.left);
            if (dist >= currentNode.mu - tau)
                nodesToVisit.push(currentNode.right);
        } else {
            if (dist < currentNode.mu + tau)
                nodesToVisit.push(currentNode.left);
            if (dist >= currentNode.mu - tau)
                nodesToVisit.push(currentNode.right);
        }
    }
    console.log("iterations: " + count);
    console.log("trash: " + trash);
    return distanceQueue.all();
}

// http://www1.cs.columbia.edu/CAVE/publications/pdfs/Kumar_ECCV08_2.pdf
// https://www.huyng.com/posts/similarity-search-101-with-vantage-point-trees
// Root contains all data
// Select a vantage point element via median distance
// Select all points within a dist mu from vp and set left. rest right
/*
class VPNode:
    elements
    left_child
    right_child
    mu

def build_vp_tree(elements):
    node = new VPNode()
    node.vp = select_random(elements)
    node.mu = median(distance(vp,e) for e in elements)
    left_elements = [e for e in elements where distance(vp, e) < mu]
    right_elements = [e for e in elements where distance(vp, e) > mu]
    node.left_child = build_vp_tree(left_elements)
    node.right_child = build_vp_tree(right_elements)
    return node

*/