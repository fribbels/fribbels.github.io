paper.install(window);
window.onload = onLoad;

function onLoad () {
    setupCanvas();


    var trash = [];
    var polygons = [];
    var polygonPaths = [];
    var polygonVertices = [];
    var polygonCenters = [];
    var iterations = 0;
    var maxIterations = 100;
    var polyRadius = 350;
    // Generate polygons
    for (var i = 0; i < 8; i++) {
        if (iterations >= maxIterations)
            break;
        var translateX = Math.random()*window.innerWidth;
        var translateY = Math.random()*window.innerHeight;
        
        var generated = generatePolygon(12, polyRadius, translateX, translateY, polygonVertices);
        var path = generated.path;
        var poly = generated.verts;
        // path.translate(translateX, translateY);

        var valid = true;
        for (var j = 0; j < polygons.length; j++) {
            if (path.intersects(polygonPaths[j])) 
                valid = false;
        }

        if (!valid) {
            i--;
            iterations++;
            continue;
        }

        path.strokeColor = 'black'; 
        path.strokeWidth = 2;    
        path.fillColor = 'grey';
        trash.push(path);
        polygons.push(poly);
        polygonPaths.push(path);
        polygonVertices.push.apply(polygonVertices, poly);

        var sumX = 0;
        var sumY = 0;
        for (var j = 0; j < poly.length; j++) {
            sumX += poly[j].x;
            sumY += poly[j].y;
        }        
        var center = new Point(sumX/poly.length, sumY/poly.length);
        polygonCenters.push(center);
        // drawDot(center, 10, 'green');
    }

    // Generate endpoints
    var startPoint;
    var endPoint;

    var valid = false;
    while (!valid) {
        valid = true;
        startPoint = new Point(Math.random()*window.innerWidth, 
                               100);
        for (var i = 0; i < polygonPaths.length; i++) {
            if (polygonPaths[i].contains(startPoint))
                valid = false;
        }
    }

    valid = false;
    while (!valid) {
        valid = true;
        endPoint = new Point(Math.random()*window.innerWidth, 
                             window.innerHeight-100);
        for (var i = 0; i < polygonPaths.length; i++) {
            if (polygonPaths[i].contains(endPoint))
                valid = false;
        }
    }
    startPoint.visited = [];
    endPoint.visited = [];
    startPoint.id = 0;
    endPoint.id = 1;
    // startPoint = new Point(window.innerWidth/2, window.innerHeight/2);  

    var startDot = new Path.Circle(startPoint, 10);
    startDot.fillColor = 'green';
    var endDot = new Path.Circle(endPoint, 10);
    endDot.fillColor = 'red';


    // console.log("len", polygonVertices.length);
    // for (var i = 0; i < polygonVertices.length; i++) {
    //     var dist = startPoint.getDistance(polygonVertices[i]);
    //     var circle = new Path.Circle(startPoint, dist);
    //     fill.union(circle);
    //     fill.
    //     circle.strokeWidth = 0.5;
    //     circle.strokeColor = 'grey';

    //     for (var j = 0; j < polygonVertices.length; j++) {
    //         var dist = polygonVertices[j].getDistance(polygonVertices[i]);
    //         var circle = new Path.Circle(polygonVertices[i], dist);
    //         circle.strokeWidth = 0.01;
    //         circle.strokeColor = 'grey';
    //     }
    // }


    // var black = new Path.Circle(startPoint, 2000);
    // black.fillColor = black;
    polygonVertices.push(endPoint);
    polygonVertices.sort(function (x, y) {
        return startPoint.getDistance(x) - startPoint.getDistance(y);
    })

    var animate = true;
    var time = 0;
    var tree = new Tree(startPoint);
    var waves = [];
    var index = 0;
    Wave.polygonVertices = polygonVertices;
    Wave.trash = trash;
    Wave.waves = waves;
    Wave.time = 2;
    Wave.index = 0;
    Wave.found = false;
    Wave.endPoint = endPoint;
    Wave.polygonCenters = polygonCenters;
    var magnitude = 10;
    // waves.push(new Wavelet(startPoint, startPoint.add(new Point(-magnitude, 0)), startPoint.add(new Point(0, -magnitude)), magnitude));
    // waves.push(new Wavelet(startPoint, startPoint.add(new Point(0, -magnitude)), startPoint.add(new Point(magnitude, 0)), magnitude));
    // waves.push(new Wavelet(startPoint, startPoint.add(new Point(magnitude, 0)), startPoint.add(new Point(0, magnitude)), magnitude));
    // waves.push(new Wavelet(startPoint, startPoint.add(new Point(0, magnitude)), startPoint.add(new Point(-magnitude, 0)), magnitude));
    waves.push(new Wave(startPoint, true, [10]))
    if (animate) window.requestAnimationFrame(update);

    view.on('keydown', update);
    function update(event) {
        // Clear trash
        if (Wave.found)
            return;
        if (!Wave.found)
            while(trash.length > 0) 
                trash.pop().remove();

        // Update wavelets
        // console.log("----------------- Len: " + waves.length + " -------------------");
        var nextIter = [];
        for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            var newWaves = wave.update();
            nextIter.push.apply(nextIter, newWaves);
        }
        waves = nextIter;

        // Draw polygons
        for (var i = 0; i < polygons.length; i++) {
            var path = new Path(polygons[i]);
            path.closed = true;
            path.strokeColor = 'black';
            path.strokeWidth = 2;
            path.fillColor = 'grey';
            trash.push(path);
        }
        if (animate) window.requestAnimationFrame(update);
    };
}

function polygonToPath (polygon) {

}



function setupCanvas() {
    canvas = document.getElementById('myCanvas');
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
    paper.setup(canvas);
}