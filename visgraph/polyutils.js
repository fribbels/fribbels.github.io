function leftTurnTest(point1, point2) {
    if (point1.cross(point2) > 0) 
        return true;  // left
    else 
        return false; // right
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function createPolygon(numPoints, boundX, boundY) {
    var arr = [];
    for (var i = 0; i < numPoints; i++) {
        arr.push(new Point(Math.random() * boundX, Math.random() * boundY));
    }

    points = pointsToPoly(arr);
    path = new Path();

    for(var i = 0; i < points.length; i++) {
        path.add(points[i]);
    }
    return path;
}

function drawPolygon(path) {
    path.strokeColor = 'green';
    for(var i = 0; i < path.segments.length; i++) {
        var dot = new Path.Circle(path.segments[i]._point, 2);
        dot.fillColor = 'green';
    }
    path.fillColor = new Color(0.3, 0.4, 0.5);
}

function randIntervalInclusive(min, max) {
    return Math.floor(Math.random()*(max-min+1) + min);
}

function distance (a, b) {
    return Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
}

function outerEdge(a, b) {
    if (a.path == undefined || b.path == undefined)
        return true;
    var points = a.path.segments;
    var left = 0;
    var right = 0;
    for (var i = 0; i < points.length; i++) {
        var p = points[i].point;
        if (equalPoints(a, p) || equalPoints(b, p))
            continue;

        var c = new Point(b.x-a.x, b.y-a.y);
        var d = new Point(p.x-a.x, p.y-a.y);

        if (leftTurnTest(c, d))
            left++;
        else
            right++;
    }
    if (left == 0 || right == 0)
        return true;
    return false;
}

function pointsToPoly(points) {
    var leftMost = points[0];
    var rightMost = points[0];

    for (var i = 0; i < points.length; i++) {
        if (points[i].x < leftMost.x)
            leftMost = points[i];
        if (points[i].x >= rightMost.x) 
            rightMost = points[i];
    }

    var aboveList = [];
    var belowList = [];

    for (var i = 0; i < points.length; i++) {
        if (points[i] == leftMost || points[i] == rightMost)
            continue;

        if (leftTurnTest(new Point(rightMost.x - leftMost.x, rightMost.y - leftMost.y), 
                         new Point(points[i].x - leftMost.x, points[i].y - leftMost.y)))
            aboveList.push(points[i]);
        else
            belowList.push(points[i]);
    }

    aboveList.sort(function(a, b) {
        return a.x-b.x;
    });

    belowList.sort(function(a, b) {
        return b.x-a.x;
    });

    var result = [leftMost];
    result = result.concat(aboveList);
    result.push(rightMost);
    result = result.concat(belowList);
    result.push(leftMost);

    return result;
}

    // VALID INTERSECTION
    // if (intersect) {
    //     if (a.path != b.path) {
    //         if (equalPoints(a, c) || equalPoints(b, c) || equalPoints(a, d) || equalPoints(b, d)) {

    //         } else {
    //             valid = false;
    //             return valid;
    //         }
    //     } else {
    //         if (!outerEdge(a, b)) {
    //             valid = false;
    //             return valid;
    //         } else {
    //             if (a.path == c.path || a.path == d.path || b.path == c.path || b.path == d.path) {

    //             } else {
    //                 valid = false;
    //                 return valid;
    //             }
    //         }   
    //     }
    // }
