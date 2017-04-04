paper.install(window);
window.onload = function() {
    // Setup directly from canvas id:

    var canvas = document.getElementById('myCanvas');
    var width = window.innerWidth;
    var height = window.innerHeight
    canvas.width = width;
    canvas.height = height;

    paper.setup('myCanvas');


    var path = new Path();
    path.strokeColor = 'black';
    
    var arr = [];
    var n = 1000;
    for (var i = 0; i < n; i++) {
        //arr.push(new Data(Math.random()*width/2+width/4, Math.random()*height/2+height/4));
        arr.push(new Data(Math.random()*width, Math.random()*height));
    }
    // var query = arr[0];
    var query = new Data(width/2, height/2);
    var root = new VPNode(arr);


    // drawknn(root, 1, query);
    
    drawArea(root, new Path.Circle(new Data(0, 0), 10000), new Color('red'));
    // drawLeft(root);
    
    for (var i = 0; i < n; i++) {
        var myCircle = new Path.Circle(arr[i], 4);
        myCircle.fillColor = 'black';
    }
    function drawArea (node, area, color) {
        if (node == undefined)
            return;

        var inside = area;
        var outside = area;

        if (node.parent == undefined) {
            var circle = new Path.Circle(node.vp, node.mu);
            node.circle = circle;
            circle.strokeColor = color;
            circle.strokeWidth = 2;
            // circle.fillColor = color;

            inside = area.intersect(circle);
            outside = area.subtract(circle);
        } else {
            var circle = new Path.Circle(node.vp, node.mu);
            var intersect = area.intersect(circle);
            intersect.strokeColor = color;
            intersect.strokeWidth = 2;
            // intersect.fillColor = color;

            inside = intersect;
            outside = area.subtract(intersect);
        }

        color.hue += 5;

        drawArea(node.left, inside, color);
        drawArea(node.right, outside, color);
    }

    function drawLeft (node) {
        if (node == undefined)
            return;

        if (node.parent == undefined) {
            var circle = new Path.Circle(node.vp, node.mu);
            node.circle = circle;
            circle.strokeColor = 'red';
        } else {
            var circle = new Path.Circle(node.vp, node.mu);
            var intersect = node.parent.circle.intersect(circle);
            intersect.strokeColor = 'red';
            node.circle = intersect;
        }
        drawLeft(node.left);
    }

    function drawknn (root, k, query) {
        var count = 0;
        var trash = 0;
        var tau = Infinity;
        var nodesToVisit = [root];
        var lastCircle;
        var distanceQueue = new DistanceQueue(query, k);
        var width = 10;

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
                // if (lastCircle == undefined) {
                //     lastCircle = new Path.Circle(currentNode.vp, currentNode.mu);
                //     lastCircle.strokeColor = new Color(0, 0, 0);
                //     lastCircle.strokeWidth = width;
                // } else {
                //     var newCircle = new Path.Circle(currentNode.vp, currentNode.mu);
                //     newCircle.strokeColor = new Color(0.7, 0.7, 0.7);

                //     var result = lastCircle.intersect(newCircle);
                //     result.strokeColor = 'black';
                //     result.strokeWidth = width-- <= 0 ? 1 : width;
                //     lastCircle = result;
                // }
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

    view.draw();
}