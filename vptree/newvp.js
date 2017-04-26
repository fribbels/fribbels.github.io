function buildTree(data, distance, bucketSize) {
    var list = [];
    for (var i = 0; i < data.length; i++) {
        list.push({i: i});
    }

    var tree = recursiveBuild(data, list, distance, bucketSize);
    return tree;
}

function recursiveBuild(data, list, distance, bucketSize) {
    if (list.length == 0)
        return null;

    // bucketSize processing

    var len = list.length;
    var index = Math.floor(Math.random() * list.length);
    var node = list[index];
    list.splice(index, 1);
    len--;
    node = {i: node.i};

    if (len == 0)
        return node;

    var vp = data[node.i];
    var dMin = Infinity;
    var dMax = 0;
    var item;
    var dist;
    var n;
    var listLength = len;

    for (var i = 0; i < listLength; i++) {
        item = list[i];
        dist = distance(vp, data[item.i]);
        item.dist = dist;
        if (dMin > dist) dMin = dist;
        if (dMax < dist) dMax = dist;
    }

    node.m = dMin;
    node.M = dMax;

    var median = select(list, Math.floor(list.length/2), 0, list.length-1, distance);
    var left = list.splice(0, Math.floor(list.length/2));
    var right = list;

    node.mu = median.dist;
    node.L = recursiveBuild(data, left, distance, bucketSize);
    node.R = recursiveBuild(data, right, distance, bucketSize);
    return node;
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
}

function knn(root, query, k) {
    var queue = new DistanceQueue(query, k);
    var tau = Infinity;
    var iter = 0;


    function search(node) {
        if (node == null)
            return;

        var id = node.i;
        var p = arr[id];
        var dist = distance(p, query);

        iter++;

        if (dist < tau) {
            queue.push(p)
            tau = distance(queue.last(), node);
        }
    }
}

paper.install(window);
window.onload = function() {
    // Setup directly from canvas id:

    var canvas = document.getElementById('myCanvas');
    var width = 600;//window.innerWidth;
    var height = 600;//window.innerHeight
    canvas.width = width;
    canvas.height = height;

    paper.setup('myCanvas');

    arr = [];
    var n = 1000;
    var k = 2;
    var neighbors = 1;
    for (var i = 0; i < n; i++) {
        var data = [];
        for (var j = 0; j < k; j++) {
            data.push(Math.random()*width);
        }
        arr.push(new kData(data));
    }
    var tree = buildTree(arr, distance);
    knn(tree, new kData([0, 0]), 1);
    console.log(tree);
}