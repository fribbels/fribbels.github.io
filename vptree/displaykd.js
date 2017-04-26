paper.install(window);
window.onload = function() {
    // Setup directly from canvas id:

    var canvas = document.getElementById('myCanvas');
    var width = 600;//window.innerWidth;
    var height = 600;//window.innerHeight
    // var width = window.innerWidth-100;
    // var height = window.innerHeight-100;
    canvas.width = width;
    canvas.height = height;

    paper.setup('myCanvas');

    var path = new Path();
    path.strokeColor = 'black';
    
    // n=100,000, n=10, k=15 iter=27,000
    // n=1m, n=10, k=1 iter=10,000
    // n=100,000, n=10, k=1 iter=5600
    var arr = [];
    var n = 1000;
    var k = 5;
    var neighbors = 10;
    for (var i = 0; i < n; i++) {
        var data = [];
        for (var j = 0; j < k; j++) {
            data.push(Math.random()*width);
        }
        arr.push(data);
    }
    // var query = new kData(width/2, height/2);
    var root = new KDNode(arr, 0, undefined);
    var tree = KDTree()(arr);

    var sum = 0;
    var count = 0;

    view.on('keydown', function(event) {
        var data = [];
        for (var i = 0; i < k; i++)
            data.push(Math.random()*width);
        var nearest = tree.find(data, neighbors);
        sum += nearest[1];
        count++;
        console.log("AVG: " + sum/count);
    });

        
    // drawArea(root, new Path.Rectangle(new Point(0, 0), new Size(width, height)), new Color('red'));



    // for (var i = 0; i < n; i++) {
    //     var myCircle = new Path.Circle(new Point(arr[i][0], arr[i][1]), 2);
    //     myCircle.fillColor = 'black';
    // }
    // for (var i = 0; i < nearest.length; i++) {
    //     var myCircle = new Path.Circle(new Point(nearest[i].datum[0], nearest[i].datum[1]), 5);
    //     myCircle.fillColor = 'black';
    // }
    
    function drawArea (node, area, color) {
        if (node == undefined)
            return;

        var left = area;
        var right = area;

        if (node.parent == undefined) {
            var rect;

            if (node.axis == 0)
                rect = new Path.Rectangle(0, 0, node.median, height);
            else
                rect = new Path.Rectangle(0, 0, width, node.median);
            // console.log(node.axis);
            // var r = new Path.Rectangle(0, 0, 250, 1000);
            // r.fillColor = 'blue';
            rect.strokeColor = color;
            // rect.fillColor = color;
            rect.strokeWidth = 1;
            node.rect = rect;

            left = area.intersect(rect);
            right = area.subtract(rect);
        } else {
            var rect;

            if (node.axis == 0)
                rect = new Path.Rectangle(0, 0, node.median, height);
            else
                rect = new Path.Rectangle(0, 0, width, node.median);
            var intersect = area.intersect(rect);
            intersect.strokeColor = color;
            intersect.strokeWidth = 1;

            left = intersect;
            right = area.subtract(intersect);
        }

        color.hue += 10;

        drawArea(node.left, left, color);
        drawArea(node.right, right, color);
    };
}