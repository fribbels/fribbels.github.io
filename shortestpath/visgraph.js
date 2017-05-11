function setupOptions() {
    boundLimit = 20;
    numPolygons = 60;
    maxCollisions = 400;
    polygonMaxVerts = 7;
}

function setupCanvas() {
    canvas = document.getElementById('myCanvas');
    width = window.innerWidth - boundLimit;
    height = window.innerHeight - boundLimit;

    canvas.width = width;
    canvas.height = height;
    paper.setup(canvas);
}

function setupVars() {
    vertCount = 0;
    vertIndex = 0;
    collisions = 0;

    vertsPerPoly = [];
    polygons = [];
    vertices = [];
    edges = [];
    segments = [];

    endData = {};
}

function choosePolygonSizes() {
    for (var i = 0; i < numPolygons; i++) {
        var numVerts = randIntervalInclusive(3, polygonMaxVerts);
        vertsPerPoly[i] = numVerts;
        vertCount += numVerts;
    }
}

function initializeVars() {
    vertices = createArray(vertCount);
    edges = createArray(vertCount, vertCount);

    startPoint = new Point(width/3, height/2);
    // endPoint = new Point(width-100, randIntervalInclusive(100, height-100));

    startPoint.edges = [];
    // endPoint.edges = [];
}

function generatePolygon(numVerts) {
    var boundX = randIntervalInclusive(75, 200);
    var boundY = randIntervalInclusive(200, 300);
    var translateX = Math.random()*(width - boundX);
    var translateY = Math.random()*(height - boundY);

    var path = createPolygon(numVerts, boundX, boundY);
    path.translate(new Point(translateX, translateY));
    return path;
}

function isInvalid(path) {
    if (path.contains(startPoint)) { // || path.contains(endPoint
        return true;
    }

    var valid = true;
    for (var j = 0; j < polygons.length; j++) {
        var inter = path.intersect(polygons[j])._segments;
        if (inter == undefined || 
            inter.length != 0  || 
            path.intersects(polygons[j])) {
            return true;
        }
    }

    return false;
}

function addPolygon(polygon, numVerts) {
    for (var j = 0; j < numVerts; j++) {
        var currIndex = vertIndex+j;
        var vert = path.segments[j].point;
        vert.path = path;
        vert.edges = [];
        vert.index = currIndex;
        vertices[currIndex] = vert;
    }

    for (var j = 0; j < numVerts; j++) {
        var k = j+1 == numVerts ? 0 : j+1;
        var a = vertIndex+j;
        var b = vertIndex+k;
        segments.push([a, b]);
    }

    vertIndex += numVerts;
}

function validIntersections(a, b, c, d) {
    var intersect = doLineSegmentsIntersect(a, b, c, d);

    if (intersect){
        if (!(equalPoints(a, c) || equalPoints(b, c) || equalPoints(a, d) || equalPoints(b, d)) 
        ||  !outerEdge(a, b)
        ||  !(a.path == c.path || a.path == d.path || b.path == c.path || b.path == d.path)) {
            return false;
        }
    }
    return true;
}

function validSegment(a, b) {
    var valid = true;
    for (var k = 0; k < segments.length; k++) {
        var c = vertices[segments[k][0]];
        var d = vertices[segments[k][1]];

        if (!validIntersections(a, b, c, d))
            return false;
    }
    return valid;
}



paper.install(window);
window.onload = function() {
    setupOptions();
    setupCanvas();
    setupVars();

    choosePolygonSizes();
    initializeVars();

    // Create Polygons
    for (var i = 0; i < numPolygons; i++) {
        if (collisions > 100)
            break;

        var numVerts = vertsPerPoly[i];
        var polygon = generatePolygon(numVerts);

        if (isInvalid(polygon)) {
            i--;
            collisions++;
            continue;
        }

        addPolygon(polygon, numVerts);

        polygons.push(polygon);
        drawPolygon(polygon);
    }
    polygons.push(new Path(startPoint));
    vertices.push(startPoint);

    // Create visibility graph
    for (var i = 0; i < vertices.length; i++) {
        var a = vertices[i];
        if (a == undefined)
            continue;

        for (var j = i+1; j < vertices.length; j++) {
            var b = vertices[j];
            if (b == undefined)
                continue;

            if (validSegment(a, b)) {
                a.edges.push(b);
                b.edges.push(a);
                drawLine(a, b);
            }
        }
    }

    drawDot(startPoint, 10, 'red');

    view.on('mousedown', function(event) {
        drawPath(event);
    });

    console.log("collisions: " + collisions);
    view.draw();
}

function clearEndData() {
    if (endData.path != undefined)
        endData.path.remove();

    if (endData.lines != undefined) {
        for (var i = 0; i < endData.lines.length; i++) {
            endData.lines[i].remove();
        }
    }

    if (endData.clearEdges != undefined) {
        for (var i = 0; i < endData.clearEdges.length; i++) {
            endData.clearEdges[i].edges.splice(-1, 1);
        }
    }

    if (endData.dots != undefined) {
        for (var i = 0; i < endData.dots.length; i++) {
            endData.dots[i].remove();
        }
    }

    if (endData.tris != undefined) {
        for (var i = 0; i < endData.tris.length; i++) {
            endData.tris[i].remove();
        }
    }

    endData = {};
    endData.lines = [];
    endData.clearEdges = [];
    endData.dots = [];
    endData.tris = [];
}

var dots = [];
function drawPath (event) {
    clearEndData();
    var q = new BinaryHeap(
        function(element) { return element.dist; },
        function(element) { return element.point.index; },
       'dist'
    );
    var prev = [];
    var dist = [];
    dist[vertices.length-1] = 0;
    startPoint.index = vertices.length-1;
    var endPoint = new Point(event.point);
    endPoint.edges = [];
    endPoint.point = endPoint;

    var visPoints = [];

    // Draw visibility graph for endpoint
    for (var i = 0; i < vertices.length; i++) {
        var a = vertices[i];
        if (a == undefined)
            continue;

        if (validSegment(a, endPoint)) {
            visPoints.push(a);
            endPoint.edges.push(a);
            a.edges.push(endPoint);

            var line = new Path();
            line.add(endPoint);
            line.add(a);
            line.strokeColor = 'red';
            line.strokeWidth = 1;
            endData.lines.push(line);
            endData.clearEdges.push(a); 
        }
    }

    // Sort by clockwise
    var atan2 = [];

    if (dots == undefined) {
        dots = [];
    } else {
        for (var i = 0; i < dots.length; i++) {
            dots[i].remove();
        }
        dots = [];
    }

    for (var i = 0; i < visPoints.length; i++) {
        var p = visPoints[i];
        // Extend
        var vector = new Point(p.x - endPoint.x, p.y - endPoint.y);
        var norm = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        vector.x = vector.x/norm * 1;
        vector.y = vector.y/norm * 1;


        var extend = new Point(p.x + vector.x, p.y + vector.y);
        var contains = false;
        // dots.push(drawDot(extend, 4, 'yellow'));


        for (var j = 0; j < polygons.length; j++) {
            if (polygons[j].contains(extend)) {
                contains = true;
            } else {

            }
        }

        if (!contains) {
            atan2.push([Math.atan2(p.y - endPoint.y, p.x - endPoint.x), p]);
            dots.push(drawDot(extend, 4, 'green'));
        } else {
            dots.push(drawDot(extend, 4, 'red'));
        }
    }


    atan2.sort(function(a, b) { 
        return a[0] - b[0];
    })

    console.log(atan2);

    // Fill tris
    // for (var i = 0; i < atan2.length; i++) {
    //     var path = new Path();
    //     path.add(atan2[i][1]);
    //     path.add(atan2[i+1 < atan2.length ? i+1 : 0][1]);
    //     path.add(endPoint);
    //     path.fillColor = 'grey';
    //     endData.tris.push(path);
    // }

    // Initialize p-queue
    for (var i = 0; i < vertices.length; i++) {
        var vert = vertices[i];
        if (vert == undefined)
            continue;

        if (!equalPoints(vert, startPoint)) {
            dist[i] = Infinity;
            prev[i] = undefined;
        }

        var obj = {point : vert, dist : dist[i]};
        q.push(obj);
    }
    endPoint.index = vertices.length;
    dist.push(Infinity);
    prev.push(undefined);
    q.push({point : endPoint, dist : Infinity});

    // Djikstras
    while (q.size() > 0) {
        var u = q.pop();
        for (var i = 0; i < u.point.edges.length; i++) {
            var v = u.point.edges[i];
            var alt = dist[u.point.index] + distance(u.point, v);

            if (alt < dist[v.index]) {
                dist[v.index] = alt;
                prev[v.index] = u.point;
                q.decreaseKey(v.index, alt);
            }
        }
    }

    // Retrieving shortest path
    var s = [];
    var u = endPoint;
    while (prev[u.index] != undefined) {
        s.push(u);
        u = prev[u.index];
    }

    var path = new Path();
    for (var i = 0; i < s.length; i++) {
        path.add(s[i]);
        endData.dots.push(drawDot(s[i], 5, 'blue'));
    }

    path.add(startPoint);
    path.strokeColor = new Color(66/256, 212/256, 244/256);
    path.strokeWidth = 7;
    endData.path = path;
}

/*
class Node(namedtuple('Node', 'location left_child right_child')):
    def __repr__(self):
        return pformat(tuple(self))

def kdtree(point_list, depth=0):
    try:
        k = len(point_list[0]) # assumes all points have the same dimension
    except IndexError as e: # if not point_list:
        return None
    # Select axis based on depth so that axis cycles through all valid values
    axis = depth % k
 
    # Sort point list and choose median as pivot element
    point_list.sort(key=itemgetter(axis))
    median = len(point_list) // 2 # choose median
 
    # Create node and construct subtrees
    return Node(
        location=point_list[median],
        left_child=kdtree(point_list[:median], depth + 1),
        right_child=kdtree(point_list[median + 1:], depth + 1)
    )

def main():
    """Example usage"""
    point_list = [(2,3), (5,4), (9,6), (4,7), (8,1), (7,2)]
    tree = kdtree(point_list)
    print(tree)

if __name__ == '__main__':
    main()
*/