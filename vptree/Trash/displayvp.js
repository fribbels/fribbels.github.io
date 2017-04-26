paper.install(window);
window.onload = function() {
    // Setup directly from canvas id:

    var canvas = document.getElementById('myCanvas');
    var width = 600;//window.innerWidth;
    var height = 600;//window.innerHeight
    canvas.width = width;
    canvas.height = height;

    paper.setup('myCanvas');


    var path = new Path();
    path.strokeColor = 'black';
    
    // n=1m, k=10, iter=86,000
    // n=100,000, k=15, k=1, iter=75,000
    var arr = [];
    var n = 1000;
    var k = 2;
    var neighbors = 1;
    mean = 0;
    div = 0;
    for (var i = 0; i < n; i++) {
        //arr.push(new Data(Math.random()*width/2+width/4, Math.random()*height/2+height/4));
        var data = [];
        for (var j = 0; j < k; j++) {
            data.push(Math.random()*width);
        }
        arr.push(new kData(data));
    }
    // var query = arr[0];
    var query = new kData([width/2, height/2]);
    // console.log(arr);
    var root = new VPNode(arr);
    var vptree = VPTreeFactory.build(arr, function(a, b) {
        return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
    });

    // drawknn(root, 1, query);
    
    var steps = [];
    steps.push();
    // drawArea(root, new Path.Circle(new Data(0, 0), 10000), new Color('red'));

    var clearDraw = [];
    // view.on('keydown', function(event) {
    //     console.log("KEY" + steps.length);
    //     var len = steps.length;
    //     for (var i = 0; i < len; i++) {
    //         var step = steps.shift();
    //         drawStep(step);
    //     }
    //     console.log("end");
    // });
    view.on('mousedown', function(event) {

        for (var i = 0; i < clearDraw.length; i++) {
            clearDraw[i].remove();
        }
        clearDraw = [];
        var data = [];
        data.push(event.point.x);
        data.push(event.point.y);
        for (var i = 0; i < k-2; i++) {
            data.push(Math.random()*width);
        }
        // var res = drawknn(root, neighbors, new kData(data));
        // for (var i = 0; i < res.length; i++) {
        //     var myCircle = new Path.Circle(res[i], 4);
        //     myCircle.fillColor = 'red';
        //     clearDraw.push(myCircle);
        // }
        // var best;
        // var tau = Infinity;
        // var iter = 0;
        // var res = recursiveNN(root, new kData(data));

        // function recursiveNN(node, query) {
        //     if (node == undefined)
        //         return;
        //     iter++;
        //     if (node.vp.dist(query) < tau) {
        //         tau = node.vp.dist(query);
        //         best = node;
        //     }

        //     if (node.vp.dist(query) > node.mu - tau)
        //         recursiveNN(node.right, query);
        //     if (node.vp.dist(query) < node.mu + tau)
        //         recursiveNN(node.left, query);
        //     return;
        // }
        // var myCircle = new Path.Circle(best.vp, 4);
        // myCircle.fillColor = 'red';
        // clearDraw.push(myCircle);
        // console.log(iter);
        var ldist = function(a, b){
          if(a.length == 0) return b.length; 
          if(b.length == 0) return a.length; 

          var matrix = [];

          // increment along the first column of each row
          var i;
          for(i = 0; i <= b.length; i++){
            matrix[i] = [i];
          }

          // increment each column in the first row
          var j;
          for(j = 0; j <= a.length; j++){
            matrix[0][j] = j;
          }

          // Fill in the rest of the matrix
          for(i = 1; i <= b.length; i++){
            for(j = 1; j <= a.length; j++){
              if(b.charAt(i-1) == a.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
              } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                        Math.min(matrix[i][j-1] + 1, // insertion
                                                 matrix[i-1][j] + 1)); // deletion
              }
            }
          }

          return matrix[b.length][a.length];
        };

        // var stringList = [
        //     'culture',
        //     'democracy',
        //     'democratic',
        //     'metaphor',
        //     'irony',
        //     'hypothesis',
        //     'science',
        //     'fastuous',
        //     'integrity',
        //     'synonym',
        //     'empathy'     // and on and on...
        // ];
        // vptree = VPTreeFactory.build(stringList, ldist);
        // nearest = vptree.search('integrityasdasd');  // [{"i":1,"d":3}]
        // index = nearest[0][0].i;           // index of nearest element is 1
        // distance = nearest[0][0].d;        // distance of nearest element is 3
        // console.log( stringList[index] ); 
        // console.log( nearest[1] + " comp" ); 
        nearest = vptree.search(new kData(data));
        console.log(nearest);
        index = nearest[0].i;           // index of nearest element is 1
        distance = nearest[0].d;        // distance of nearest element is 3
        console.log( arr[index] ); 
        console.log( nearest[1] + " comp" ); 
    });

    view.on('keydown', function(event) {
        // console.log("KEY" + steps.length);
        // var len = steps.length;
        // for (var i = 0; i < len; i++) {
        //     var step = steps.shift();
        //     drawStep(step);
        // }
        // console.log("end");
        

        for (var i = 0; i < clearDraw.length; i++) {
            clearDraw[i].remove();
        }
        clearDraw = [];
        var data = [];
        for (var i = 0; i < k; i++) {
            data.push(Math.random()*width);
        }
        var res = drawknn(root, 1, new kData(data));
        for (var i = 0; i < res.length; i++) {
            var myCircle = new Path.Circle(res[i], 4);
            myCircle.fillColor = 'red';
            clearDraw.push(myCircle);
        }
    });
    
    for (var i = 0; i < n; i++) {
        var myCircle = new Path.Circle(arr[i], 2);
        myCircle.fillColor = 'black';
    }
    
    function drawStep (data) {
        var node = data[0];
        var area = data[1];
        var color = data[2];
        if (node == undefined)
            return;

        
        // var myCircle = new Path.Circle(node.vp, 4);
        // myCircle.fillColor = 'blue';

        var inside = area;
        var outside = area;

        if (node.parent == undefined) {
            var circle = new Path.Circle(node.vp, node.mu);
            node.circle = circle;
            circle.strokeColor = 'black';
            circle.strokeWidth = 2;

            inside = area.intersect(circle);
            outside = area.subtract(circle);
        } else {
            var circle = new Path.Circle(node.vp, node.mu);
            var intersect = area.intersect(circle);
            intersect.strokeColor = 'black';
            intersect.strokeWidth = 2;
            // intersect.fillColor = color;

            inside = intersect;
            outside = area.subtract(intersect);
        }

        color.hue += 15;
        steps.push([node.left, inside, color]);
        steps.push([node.right, outside, color]);
        // drawArea(node.left, inside, color);
        // drawArea(node.right, outside, color);
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
            // console.log(count, nodesToVisit.length, query);
            var currentNode = nodesToVisit.pop();
            // var currentNode = nodesToVisit.splice(0, 1)[0]; // Remove first element
            if (currentNode == undefined) {
                trash++;
                continue;
            }
            count++;
            var dist = currentNode.vp.dist(query);

            // var myCircle = new Path.Circle(query, tau);
            // var myCircle2 = new Path.Circle(currentNode.vp, 5);
            // myCircle.strokeColor = 'lightgreen';
            // myCircle2.fillColor = 'blue';
            // clearDraw.push(myCircle);
            // clearDraw.push(myCircle2);


            if (!distanceQueue.contains(currentNode.vp) && dist < tau) {
                distanceQueue.push(currentNode.vp);
                // var farthest = distanceQueue.last();
                tau = query.dist(currentNode.vp);
            }
            // if (dist >= currentNode.mu - tau && dist <= currentNode.mu + tau) {
            //     nodesToVisit.push(currentNode.left);
            //     nodesToVisit.push(currentNode.right);
            // } else if (dist < currentNode.mu - tau) {
            //     nodesToVisit.push(currentNode.left);
            // } else if (dist > currentNode.mu + tau) {
            //     nodesToVisit.push(currentNode.right);
            // }

            // if (dist >= currentNode.mu - tau)
            //     nodesToVisit.push(currentNode.right);
            // if (dist <= currentNode.mu + tau) 
            //     nodesToVisit.push(currentNode.left);

            if (dist <= currentNode.mu) {
                if (dist >= currentNode.mu - tau)
                    nodesToVisit.push(currentNode.right);
                if (dist <= currentNode.mu + tau) 
                    nodesToVisit.push(currentNode.left);
            } else {
                if (dist <= currentNode.mu + tau) 
                    nodesToVisit.push(currentNode.left);
                if (dist >= currentNode.mu - tau)
                    nodesToVisit.push(currentNode.right);
            }
        }
        mean += count;
        div++;
        // console.log("iterations: " + count);
        console.log("avg: " + mean/div);
        // console.log("trash: " + trash);
        return distanceQueue.all();
    }

    view.draw();
}