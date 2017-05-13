kdpaper = new paper.PaperScope();
kdpaper.install(window);

vppaper = new paper.PaperScope();
vppaper.install(window);

window.onload = function() {
    // Setup directly from canvas id:

    width = 600;//window.innerWidth;
    height = 600;//window.innerHeight
    strokeWidth = 1;
    drawType = "all";
    n = 1000;
    dotSize = 2;


    strokeWidth = parseFloat(getParameterByName("strokeWidth")) || 1;
    drawType = getParameterByName("type") || "all";
    var size = parseFloat(getParameterByName("size")) || 600;
    width = size;
    height = size;
    n = parseFloat(getParameterByName("n")) || 1000;
    dotSize = parseFloat(getParameterByName("dotSize")) || 2;

    kdcanvas = document.getElementById('kdcanvas');
    vpcanvas = document.getElementById('vpcanvas');

    kdcanvas.width = width;
    kdcanvas.height = height;
    vpcanvas.width = width;
    vpcanvas.height = height;


    // draw();
    var builds = 5;
    var runs = 10;

    // for (n of [1100, 2100, 4100, 8200, 17000, 33000, 90000, 140000])
    // for (d of [5])
    // for (k of [1000])
    // for (b of [0])
    //     profile(builds, runs, n, d, k, b);
    // console.log("DONE");   


    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    draw();
}

function profile(builds, runs, n, d, k, b) {
    var vpIterations = 0;
    var kdIterations = 0;

    for (var i = 0; i < builds; i++) {
        var data = generateData(n, d, height);
        var vpData = generateVPData(data);
        var kdData = generateKDData(data);

        // Build tree
        var vpTree = buildVPTree(vpData, b);
        var kdTree = KDTree()(kdData);

        // KNN
        for (var j = 0; j < runs; j++) {
            var vpQuery = generateVPQuery(d);
            kdQuery = convertToKDQuery(vpQuery);
               
            var vpResults = knn(vpTree, vpQuery, k);
            var kdResults = kdTree.find(kdQuery, k);

            vpIterations += vpResults.iterations;
            kdIterations += kdResults.iterations;
            // console.log("vp: ", vpResults.iterations);
            // console.log("kd: ", kdResults.iterations);
        }
    }

    // console.log("results for: n="+n+" d="+d+" k="+k+" b="+b)
    // console.log("vp avg: ", Math.ceil(vpIterations/(runs*builds)));
    // console.log("kd avg: ", Math.ceil(kdIterations/(runs*builds)));

    console.log([n, d, k, b, Math.ceil(vpIterations/(runs*builds)), Math.ceil(kdIterations/(runs*builds))])
}

function draw() {
    // var n = 1000;
    var d = 2;
    var k = 1;
    var b = 1;
    var stepDraw = false;

    // Generate n nodes with d dimensions
    var data = generateData(n, d, height);
    var vpData = generateVPData(data);
    var kdData = generateKDData(data);

    // Build tree
    var vpTree = buildVPTree(vpData, b);
    var kdTree = KDTree()(kdData);

    // KNN
    var vpQuery = generateVPQuery(d, false);
    var kdQuery = generateKDQuery(d, false);
    kdQuery = convertToKDQuery(vpQuery);

    var vpResults = knn(vpTree, vpQuery, k);
    var kdResults = kdTree.find(kdQuery, k);

    console.log("kdtree: ", kdResults.iterations);
    console.log("vptree: ", vpResults.iterations);
    trash = []
    layers = [];
    // Draw
    if (drawType == "all") {
        kdpaper.setup('kdcanvas');
        drawAllData(vpData);
        var universe = new kdpaper.Path.Circle(new kData([0, 0]), 10000);
        drawKDTree(kdTree, universe, new Color('red'));

        vppaper.setup('vpcanvas');
        drawAllData(vpData);
        universe = new vppaper.Path.Circle(new kData([0, 0]), 10000);
        drawVPTree(vpTree, universe, new Color('red'));
    } else {
        stepDraw = true;
        kdsteps = [];
        vpsteps = [];
        vppaper.setup('vpcanvas');
        firstStep = [vpTree, new vppaper.Path.Circle(new kData([0, 0]), 10000), new Color('red')];
        vpsteps.push(firstStep);
        drawAllData(vpData);
        drawIndex = 0;
        drawSave = [firstStep];

        if (drawType == 'leftright') {
            vppaper.view.on('keydown', function(event) {
                project.clear();
                drawAllData(vpData);
                firstStep = [vpTree, new vppaper.Path.Circle(new kData([0, 0]), 10000), new Color('red')];
                vpsteps = [firstStep];

                if (Key.isDown('left')) {
                    console.log("left");
                    drawIndex--;
                    if (drawIndex < 0) {
                        drawIndex = 0;
                        return;
                    }

                    for (var j = 0; j < drawIndex; j++) {
                        var vplen = vpsteps.length;
                        for (var i = 0; i < vplen; i++) {
                            var step = vpsteps.shift();
                            drawVPTree(step[0], step[1], step[2]);
                        }
                    }
                }

                if (Key.isDown('right')) {
                    console.log("right", vpsteps.length);
                    drawIndex++;

                    for (var j = 0; j < drawIndex; j++) {
                        var vplen = vpsteps.length;
                        for (var i = 0; i < vplen; i++) {
                            var step = vpsteps.shift();
                            drawVPTree(step[0], step[1], step[2]);
                        }
                    }
                }
            });

            kdpaper.setup('kdcanvas');
            kdsteps.push([kdTree, new kdpaper.Path.Circle(new kData([0, 0]), 10000), new Color('red')]);
            drawAllData(vpData);
            kdpaper.view.on('keydown', function(event) {
                var kdlen = kdsteps.length;
                for (var i = 0; i < kdlen; i++) {
                    var step = kdsteps.shift();
                    drawKDTree(step[0], step[1], step[2]);
                }
            });
        }

        if (drawType == 'steps') {
            vppaper.view.on('keydown', function(event) {
                var vplen = vpsteps.length;
                for (var i = 0; i < vplen; i++) {
                    var step = vpsteps.shift();
                    drawVPTree(step[0], step[1], step[2]);
                }
            });

            kdpaper.setup('kdcanvas');
            kdsteps.push([kdTree, new kdpaper.Path.Circle(new kData([0, 0]), 10000), new Color('red')]);
            drawAllData(vpData);
            kdpaper.view.on('keydown', function(event) {
                var kdlen = kdsteps.length;
                for (var i = 0; i < kdlen; i++) {
                    var step = kdsteps.shift();
                    drawKDTree(step[0], step[1], step[2]);
                }
            });
        }

        // kdpaper.setup('kdcanvas');
        // kdsteps.push([kdTree, new kdpaper.Path.Circle(new kData([0, 0]), 10000), new Color('red')]);
        // drawAllData(vpData);
        // kdpaper.view.on('keydown', function(event) {
        //     var kdlen = kdsteps.length;
        //     for (var i = 0; i < kdlen; i++) {
        //         var step = kdsteps.shift();
        //         drawKDTree(step[0], step[1], step[2]);
        //     }
        // });

    }
    // drawVPResults(vpResults.nearestNodes);
    // drawKDResults(kdResults.nearestNodes);
}

function convertToKDQuery(kdQuery) {
    query = [];
    for (var i = 0; i < kdQuery.arr.length; i++)
        query.push(kdQuery.arr[i]);
    return query;
}

function generateKDQuery(d, zero) {
    query = [];
    for (var i = 0; i < d; i++) {
        var data = zero ? 0 : Math.random() * height;
        query.push(data);
    }
    return query;
}

function generateVPQuery(d, zero) {
    var query = [];
    for (var i = 0; i < d; i++) {
        var data = zero ? 0 : Math.random() * height;
        query.push(data);
    }

    if (d == 2)
        data[1] += height;
    return new kData(query);
}

function drawDot(obj, size, color) {
    var dot = new Path.Circle(obj, size);
    dot.fillColor = color;
}

function drawAllData(arr) {
    for (var i = 0; i < arr.length; i++) {
        drawDot(arr[i], dotSize, 'black');
    }
}

function drawKDResults(arr) {
    for (var i = 0; i < arr.length; i++) 
        drawDot(arr[i].datum, 3, 'blue');
}

function drawVPResults(arr) {
    for (var i = 0; i < arr.length; i++) 
        drawDot(arr[i].i, 5, 'red');
}
function generateData (n, d, k) {
    var arr = [];
    for (var i = 0; i < n; i++) {
        var data = [];
        for (var j = 0; j < d; j++) {
            data.push(Math.random()*height);
        }
        arr.push(data);
    }
    return arr;
}
function generateVPData (data) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
        arr.push(new kData(data[i]));
                   
    }
    return arr;
}

function generateKDData (data) {
    return data;
}

function drawVPTree (node, area, color) {
    if (node == undefined)
        return;

    var inside = area;
    var outside = area;
    if (node.isRoot) {
        var circle = new vppaper.Path.Circle(node.vp, node.mu);
        node.circle = circle;
        circle.strokeColor = color;
        circle.strokeWidth = strokeWidth;

        trash.push(circle);

        inside = area.intersect(circle);
        outside = area.subtract(circle);
    } else {
        var circle = new vppaper.Path.Circle(node.vp, node.mu);
        var intersect = area.intersect(circle);
        intersect.strokeColor = color;
        intersect.strokeWidth = strokeWidth;

        trash.push(intersect);
        trash.push(circle);

        inside = intersect;
        outside = area.subtract(intersect);
    }

    color.hue += 10;
    if (drawType != "all") {
        vpsteps.push([node.left, inside, color]);
        vpsteps.push([node.right, outside, color]);
    } else {
        drawVPTree(node.left, inside, color);
        drawVPTree(node.right, outside, color);    
    }
}


function drawKDTree (node, area, color) {
    if (node == undefined)
        return;

    var left = area;
    var right = area;
    var median = node.median[node.axis];
    if (node.parent == undefined) {
        var rect;

        rect = new kdpaper.Path.Rectangle(0, 0, median, height);
        rect.strokeColor = color;
        rect.strokeWidth = strokeWidth;
        node.rect = rect;

        left = area.intersect(rect);
        right = area.subtract(rect);
    } else {
        var rect;

        if (node.axis == 0)
            rect = new kdpaper.Path.Rectangle(0, 0, median, height);
        else
            rect = new kdpaper.Path.Rectangle(0, 0, height, median);
        var intersect = area.intersect(rect);
        intersect.strokeColor = color;
        intersect.strokeWidth = strokeWidth;

        left = intersect;
        right = area.subtract(intersect);
    }

    color.hue += 10;

    if (drawType != "all") {
        kdsteps.push([node.subnodes[0], left, color]);
        kdsteps.push([node.subnodes[1], right, color]);
    } else {
        drawKDTree(node.subnodes[0], left, color);
        drawKDTree(node.subnodes[1], right, color);    
    }
};