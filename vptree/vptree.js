class kData {
    constructor(arr) {
        this.arr = arr;
        this.x = arr[0];
        this.y = arr[1];
        this.length = arr.length;
    }

    distance(other) {
        var sum = 0;
        for (var i = 0; i < this.arr.length; i++) {
            sum += Math.pow(other.arr[i] - this.arr[i], 2);
        }
        return Math.sqrt(sum);
    }
}

function buildVPTree(data, bucketSize, parent) {
    // bucketSize = bucketSize || 1;
    var list = [];
    for (var i = 0; i < data.length; i++) {
        list.push(new kData(data[i].arr));
    }

    var tree = recursiveBuild(list, bucketSize);
    tree.isRoot = true;
    return tree;
}

function randomIndex(arr) {
    return Math.floor(Math.random() * arr.length);
}

function recursiveBuild(data, bucketSize) {
    if (data.length == 0)
        return null;

    if (data.length <= bucketSize) {
        return data;
    }

    // var vp = data[randomIndex(data)];
    var vp = data.splice(randomIndex(data), 1)[0];
    var node = {vp:vp};

    if (data.length == 0)
        return node;

    // Calculate distances
    var dMin = Infinity;
    var dMax = 0;
    var distances = [];
    for (var i = 0; i < data.length; i++) {
        var dist = vp.distance(data[i]);
        distances[i] = dist;
        if (dMin > dist) 
            dMin = dist;
        if (dMax < dist) 
            dMax = dist;
    }

    // Partition lists
    var mu = select(distances, Math.floor(distances.length/2));
    var leftList = [];
    var rightList = [];
    for (var i = 0; i < data.length; i++) {
        if (vp.distance(data[i]) < mu)
            leftList.push(data[i]);
        else
            rightList.push(data[i]);
    }

    node.mu = mu;
    node.m = dMin;
    node.M = dMax;
    node.left = recursiveBuild(leftList, bucketSize);
    node.right = recursiveBuild(rightList, bucketSize);
    return node;
}

function isLeaf(node) {
    if (node.length > 0)
        return true;
    return false;
}

function knn(root, query, k) {
    var queue = new PriorityQueue(k);
    var tau = Infinity;
    var iterations = 0;

    function search(node) {
        if (node == null)
            return;

        if (isLeaf(node)) {
            for (var i = 0; i < node.length; i++) {
                var elem = node[i];
                var dist = elem.distance(query);
                if (dist < tau)
                    tau = queue.insert(elem, dist) || tau;
            }
            iterations += node.length;
            return;
        }

        iterations++;
        var dist = node.vp.distance(query);
        if (dist < tau)
            tau = queue.insert(node.vp, dist) || tau;

        var mu = node.mu;
        var m = node.m;
        var M = node.M;
        var left = node.left;
        var right = node.right;

        if (dist < mu) {
            if (dist > m - tau)
                search(left);
            if (dist > mu - tau)
                search(right);
        } else {
            if (dist < M + tau)
                search(right);
            if (dist < mu + tau)
                search(left);
        }
    }

    search(root);
    return {nearestNodes: queue.list(), iterations: iterations};
}
