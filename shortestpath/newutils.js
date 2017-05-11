class Tree {
    constructor (point) {
        this.point = point;
    }
}

function randomColor() {
    return new Color(Math.random(),
                     Math.random(),
                     Math.random());
}

class Wave {
    constructor (root, isCircle, data) {
        // console.log("NEW-WAVE");
        this.root = root;
        this.color = randomColor();
        this.isCircle = isCircle;
        this.polygonVertices = Wave.polygonVertices.slice().sort(function (x, y) {
            return root.getDistance(x) - root.getDistance(y);
        })
        this.index = 0;

        if (isCircle) {
            this.radius = data[0];
        } else {
            this.radius = data[0];
            this.left = data[1];
            this.right = data[2];
            this.origLeft = data[1];
            this.origRight = data[2];
            if (!data[3])
                this.index = 0;
            else
                this.index = data[3];

            // if (!data[4])
            //     this.authorized = [];
            // else 
            // this.authorized = [];
            // this.authorized.push(this.left);
            // this.authorized.push(this.right);
            // [this.left, this.right];
        }
    }

    update () {

        this.radius += Wave.time;
        this.oldexpand();
        this.draw();
        var collisions = [];
        var nextIter = [];

        // Count collisions
        // console.log(this, this.index);
        var checks = 0;
        for (var i = 0; i < Wave.polygonCenters.length; i++) {
            var collision = Wave.polygonCenters[i];
            var dist = this.root.getDistance(collision);
            if (this.radius < dist)
                break;

            if (this.checkCollide(collision)) {
                // console.error("HA");
                return [];
            }
        }

        for (var i = this.index; i < this.polygonVertices.length; i++) {
            // Check collision against vertices       
            var collision = this.polygonVertices[i];
            var dist = this.root.getDistance(collision);
            if (this.radius < dist)
                break;
            checks++;
            this.index = i+1;

            // Out of bounds
            if (!this.checkCollide(collision)) {
                continue;
            }

            if (collision.marked == undefined) {
                collision.marked = 0;
                collision.parent = this.root;
            }

            if (collision == this.root)
                continue;

            if (collision.visited[this.root.id] == true) {
                continue;
            } else {
                collision.visited[this.root.id] = true;
            }

            if (collision == Wave.endPoint && !Wave.found) {
                drawDot(collision, 10, 'red');
                Wave.found = true;

                var path = new Path();
                path.add(Wave.endPoint);
                var current = this.root;
                var size = 4;
                while (current) {
                    console.log("ITER", current);
                    path.add(current);
                    drawDot(current, 6, 'orange');
                    current = current.parent;
                    size/=2
                }
                path.strokeWidth = 5;
                path.strokeColor = 'blue';
                continue;
            }

            // Found a collision!
            if (!Wave.found)
                collisions.push(collision);
            collision.marked++;

            drawDot(collision, 5, 'red');
        }

        // Split on collisions
        if (collisions.length == 0) {
            nextIter.push(this);
        } else {
            for (var i = 0; i < collisions.length; i++) {
                var collision = collisions[i];
                var newWaves = this.split(collision);
                nextIter.push.apply(nextIter, newWaves);
            }
        }

        return nextIter;
    }

    split (collision) {
        collision.left.authorized.push(this.root);
        collision.left.authorized.push(collision);

        collision.right.authorized.push(this.root);
        collision.right.authorized.push(collision);
        if (this.isCircle)
            return this.splitCircle(collision);
        else 
            return this.splitWave(collision);
    }

    splitCircle (collision) {
        // Switch left/rights of collision
        var newWaves = [];
        if (this.rayTestInside(collision)) {
            newWaves = this.splitCircleInside(collision);
        } else {
            newWaves = this.splitCircleOutside(collision);
        }

        var bounceLeft = collision.right;
        var bounceRight = collision.left;
        // bounceLeft.authorized.push(collision);
        // bounceLeft.authorized.push(this.root);
        // bounceRight.authorized.push(collision);
        // bounceRight.authorized.push(this.root);

        // collision.parent = this.root;
        var bounceWave = new Wave(collision, false, [0, bounceLeft, bounceRight, 0]);

        if (collision.marked < 2)
            newWaves.push(bounceWave);

        return newWaves;
    }

    splitCircleInside (collision) {
        var leftPoint = collision.right;
        var rightPoint = collision.left;

        // this.isCircle = false;

        // this.left = leftPoint.subtract(this.root).normalize(this.radius).add(this.root);
        // this.right = rightPoint.subtract(this.root).normalize(this.radius).add(this.root);

        var newWave = new Wave(this.root, false, [this.radius, leftPoint, rightPoint, this.index])
        // leftPoint.authorized.push(this.root);
        // rightPoint.authorized.push(this.root);
        return [newWave];
    }

    splitCircleOutside (collision) {
        if (left(collision.right, collision, this.root)) {
            var leftPoint = collision;
            var rightPoint = collision.left;
            var newWave = new Wave(this.root, false, [this.radius, leftPoint, rightPoint, this.index]);
            // leftPoint.authorized.push(this.root);
            // rightPoint.authorized.push(this.root);

            return [newWave];
        } else {
            var leftPoint = collision.right;
            var rightPoint = collision;
            var newWave = new Wave(this.root, false, [this.radius, leftPoint, rightPoint, this.index]);
            // leftPoint.authorized.push(this.root);
            // rightPoint.authorized.push(this.root);

            return [newWave];
        }
    }

    splitWave (collision) {
        // console.log("splitWave");
        var newWaves = []
        if (this.rayTestInside(collision)) {
            newWaves = this.splitWaveInside(collision);
        } else {
            newWaves = this.splitWaveOutside(collision);
        }

        var bounceLeft = collision.right;
        var bounceRight = collision.left;
        // collision.parent = this.root;
        var bounceWave = new Wave(collision, false, [0, bounceLeft, bounceRight, 0]);
        // bounceLeft.authorized.push(this.root);
        // bounceLeft.authorized.push(collision);
        // bounceRight.authorized.push(this.root);
        // bounceRight.authorized.push(collision);

        if (collision.marked < 2)
            newWaves.push(bounceWave);

        return newWaves;
    }


    splitWaveInside (collision) {
        var newWaves = [];
        if (this.insideArc(collision.left) && this.insideArc(collision.right)) {
            // Case 1
            var leftWave = new Wave(this.root, false, [this.radius, this.left, collision.left, this.index]);
            var rightWave = new Wave(this.root, false, [this.radius, collision.right, this.right, this.index]);
            newWaves = [leftWave, rightWave];
        } else if (this.insideArc(collision.left) && !this.insideArc(collision.right)) {
            // Case 2
            var leftWave = new Wave(this.root, false, [this.radius, this.left, collision.left, this.index]);
            newWaves = [leftWave];
        } else if (this.insideArc(collision.right) && !this.insideArc(collision.left)) {
            // Case 3
            var rightWave = new Wave(this.root, false, [this.radius, collision.right, this.right, this.index]);
            newWaves = [rightWave];
        } else {
            // console.error("WTF? splitWaveInside");
        }
        return newWaves;
    }
    splitWaveOutside (collision) {
        var newWaves = [];
        if (left(collision.right, collision, this.root)) {
            if (this.origLeft == collision || this.origRight == collision)
                return [this];

            if (this.right.subtract(this.root).getDistance(collision.subtract(this.root)) < Wave.time
            ||  this.left.subtract(this.root).getDistance(collision.subtract(this.root)) < Wave.time) {
                return [this];
            }

            // Case 1-5
            if (this.insideArc(collision.left) && this.insideArc(collision.right)) {
                // Case 1
                // console.error("Case 1");
                var leftWave = new Wave(this.root, false, [this.radius, this.left, collision.left, this.index]);
                var rightWave = new Wave(this.root, false, [this.radius, collision, this.right, this.index]);
                newWaves = [leftWave, rightWave];
            } else {
                // Case 2-5
                // console.error("Case 2-5");
                var rightWave = new Wave(this.root, false, [this.radius, collision, this.right, this.index]);
                newWaves = [rightWave];
            }
        } else if (right(collision.left, collision, this.root)) {
            if (this.origLeft == collision || this.origRight == collision)
                return [this];

            if (this.right.subtract(this.root).getDistance(collision.subtract(this.root)) < Wave.time
            ||  this.left.subtract(this.root).getDistance(collision.subtract(this.root)) < Wave.time) {
                return [this];
            }
            // Case 6-10
            if (this.insideArc(collision.left) && this.insideArc(collision.right)) {
                // Case 6
                // console.error("Case 6");
                var leftWave = new Wave(this.root, false, [this.radius, this.left, collision, this.index]);
                var rightWave = new Wave(this.root, false, [this.radius, collision.right, this.right, this.index]);
                newWaves = [leftWave, rightWave];
            } else {
                // Case 7-10
                // console.error("Case 7-10");
                var leftWave = new Wave(this.root, false, [this.radius, this.left, collision, this.index]);
                newWaves = [leftWave];
            }
        } else {
            // Case 11
            console.error("Should split inside");
        }

        return newWaves;
    }

    checkCollide (collision) {
        if (this.isCircle)
            return true;

        return this.insideArc(collision);
    }

    rayTestInside (collision) {
        var delta = collision.subtract(this.root).normalize().multiply(0.5);
        var extend = collision.add(delta);
        if (collision.path.contains(extend))
            return true;
        return false;
    }

    insideArc(point) {

        if (!this.isCircle) {
            if (this.origLeft == point || this.origRight == point)
                return true;

            if (this.right.subtract(this.root).getDistance(point.subtract(this.root)) < Wave.time
            ||  this.left.subtract(this.root).getDistance(point.subtract(this.root)) < Wave.time) {
                // console.error("CLOSE SHAVE");
                return true;
            }
        }

        if (point.subtract(this.root).normalize().getDistance(this.right.subtract(this.root).normalize()) < 0.01 
        ||  point.subtract(this.root).normalize().getDistance(this.left.subtract(this.root).normalize()) < 0.01) {
            // console.log("Corner case!");
            return false;
        }

        var a = this.left.subtract(this.root);
        var b = this.right.subtract(this.root);
        
        var arcAngle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
        if (arcAngle < 0)
            arcAngle = 2*Math.PI + arcAngle;

        a = this.left.subtract(this.root);
        b = point.subtract(this.root);

        var queryAngle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
        if (queryAngle < 0)
            queryAngle = 2*Math.PI + queryAngle;


        if (queryAngle * 180 / Math.PI < 1) {
            return false;
        }

        // console.log("ANGLE", arcAngle * 180 / Math.PI, queryAngle * 180 / Math.PI);

        return queryAngle < arcAngle;
    }

    angleBetween () {
    }

    draw () {
        var path = this.oldtoPath();
        if (!path)
            return;
        path.strokeColor = this.color;
        path.strokeWidth = 1.25;
        // path.add(this.root);
        // path.closed = true;
        // path.fillColor = this.color;
        Wave.trash.push(path);
    }

    toPath () {
        if (this.isCircle) {
            return new Path.Circle(this.root, this.radius);
        }
    }

    oldtoPath () {
        if (this.isCircle) {
            return new Path.Circle(this.root, this.radius);
        }
        var a = this.left.subtract(this.root);
        var b = this.right.subtract(this.root);
        
        var angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
        if (angle < 0)
            angle = 2*Math.PI + angle;
        angle /= 2;
        var m = a.rotate(angle, new Point(0, 0));
        var M = this.root.add(m);
        try {
            return new Path.Arc(this.left, M, this.right);
        } catch (err) {

        }
    }


    // constructor (root, left, right, radius) {
    //     this.root = root;
    //     this.left = left;
    //     this.right = right;
    //     this.radius = radius;
    //     this.color = randomColor();
    //     this.polygonVertices = Wave.polygonVertices.slice();
    //     this.polygonVertices.sort(function (x, y) {
    //         return root.getDistance(x) - root.getDistance(y);
    //     })
    //     this.index = 0;
    //     this.prevDist = 0;
    // }

    oldexpand () {
        if (this.isCircle)
            return;
        var vl = this.left.subtract(this.root).normalize().multiply(this.radius).add(this.root);
        var vr = this.right.subtract(this.root).normalize().multiply(this.radius).add(this.root);
        this.left = vl;
        this.right = vr;
    }

    oldcheckCollide (point) {
        if (point.getDistance(this.root)-this.left.getDistance(this.root) < 0.1)
            if (right(point, this.left, this.root))
                if (left(point, this.right, this.root))
                    return true;
        return false;
    }

    oldsplit (collision) {
        drawDot(collision, 7, 'orange');
        if (this.rayTestInside(collision)) 
            return this.splitInside(collision);
        // return this.splitOutside(collision);
    }

    // oldsplitInside (collision) {
    //     var newWaves = [];
    //     var leftPoint = collision;
    //     var rightPoint = collision;

    //     while (this.rayTestInside(leftPoint)) {
    //         leftPoint = leftPoint.left;
    //     }
    //     drawDot(leftPoint, 4, 'red');
    //     while (this.rayTestInside(rightPoint)) {
    //         drawDot(rightPoint, 3, 'blue');
    //         rightPoint = rightPoint.right;
    //     }
    //     drawDot(rightPoint, 3, 'blue');

    //     if (left(this.left, leftPoint, this.root)) {
    //         var leftWave = new Wave(this.root, this.left, leftPoint, this.radius);
    //         newWaves.push(leftWave);
    //     }
    //     if (right(this.right, rightPoint, this.root)) {
    //         var rightWave = new Wave(this.root, rightPoint, this.right, this.radius);
    //         newWaves.push(rightWave);
    //     }

    //     return newWaves;
    // }

    // oldsplitOutside (collision) {
    //     var newWaves = []
    //     var leftPoint = collision;
    //     var rightPoint = collision;

    //     if (left(collision.right, collision, this.root)) {
    //         var rightWave = new Wave(this.root, collision, this.right, this.radius);
    //         newWaves.push(rightWave);

    //         leftPoint = collision.left;
    //         while (this.rayTestInside(leftPoint)) {
    //             leftPoint = leftPoint.left;
    //         }
            
    //         if (left(this.left, leftPoint, this.root)) {
    //             var leftWave = new Wave(this.root, this.left, leftPoint, this.radius);
    //             newWaves.push(leftWave);
    //         }
    //     } else {
    //         var leftWave = new Wave(this.root, this.left, collision, this.radius);
    //         newWaves.push(leftWave);

    //         rightPoint = collision.right;
    //         while(this.rayTestInside(rightPoint)) {
    //             rightPoint = rightPoint.right;
    //         }

    //         if (left(rightPoint, this.right, this.root)) {
    //             var rightWave = new Wave(this.root, rightPoint, this.right, this.radius);
    //             newWaves.push(rightWave);
    //         }
    //     }

    //     var newCenter = collision;

    //     var mid = newCenter.left.add(newCenter.right).divide(2);
    //     var opp = mid.subtract(newCenter).multiply(-1).normalize(newCenter.getDistance(newCenter.left)).add(newCenter);

    //     var oppLeftWave = new Wave(newCenter, newCenter.right, opp, 0.1);
    //     var oppRightWave = new Wave(newCenter, opp, newCenter.left, 0.1);
    //     newWaves.push(oppLeftWave);
    //     newWaves.push(oppRightWave);

    //     return newWaves;
    // }
}

function drawDot (center, radius, color) {
    if (!color) 
        color = 'black'
    var circle = new Path.Circle(center, radius);
    circle.fillColor = color
    return circle;
}

function leftTurnTest(vec1, vec2) {
    if (vec1.cross(vec2) > 0) 
        return true;  // left
    return false; // right
}


function left(p1, p2, s) {
    return leftTurnTest(p1.subtract(s), p2.subtract(s));
}
function right(p1, p2, s) {
    return !leftTurnTest(p1.subtract(s), p2.subtract(s));
}
id = 2;
function generatePolygon(numEdges, radius, translateX, translateY, polygonVertices) {
    var angles = [];
    var verts = [];
    for (var i = 0; i < numEdges; i++) {
        angles.push(2 * Math.PI * Math.random());
    }

    angles.sort();
    for (var i = 0; i < numEdges; i++) {
        var x = radius * Math.cos(angles[i]) + translateX;
        var y = radius * Math.sin(angles[i]) + translateY;
        var point = new Point(x, y);
        point.visited = [];
        point.authorized = [];
        point.id = id++;
        // var flag = false;
        // for (var j = i; j < polygonVertices.length; j++) {
        //     // console.log(point, polygonVertices[j]);
        //     if (point.getDistance(polygonVertices[j]) < 5) {
        //         i--;
        //         flag = true;
        //     }
        // }
        // if (flag)
        //     continue;
        verts.push(point);
    }

    var path = new Path(verts);function leftTurnTest(point1, point2) {
    if (point1.cross(point2) > 0) 
        return true;  // left
    return false; // right
}

    path.closed = true;

    for (var i = 0; i < verts.length; i++) {
        var right = i-1 < 0 ? verts.length-1 : i-1;
        var left = i+1 > verts.length-1 ? 0 : i+1;

        verts[i].left = verts[left];
        verts[i].right = verts[right];
        verts[i].path = path;
    }
    return {verts: verts, path: path};
}

/*

            if (left(_p1, _p2, s) && left(_p2, _p3, s)) {
                p1 = _p1; p2 = _p2; p3 = _p3;
            } else if (left(_p1, _p3, s) && left(_p3, _p2, s)) {
                p1 = _p1; p2 = _p3; p3 = _p2;
            } else if (left(_p2, _p1, s) && left(_p1, _p3, s)) {
                p1 = _p2; p2 = _p1; p3 = _p3;
            } else if (left(_p2, _p3, s) && left(_p3, _p1, s)) {
                p1 = _p2; p2 = _p3; p3 = _p1;
            } else if (left(_p3, _p1, s) && left(_p1, _p2, s)) {
                p1 = _p3; p2 = _p1; p3 = _p2;
            } else {
                p1 = _p3; p2 = _p2; p3 = _p1;
            }

            // drawDot(p1, 5);
            // drawDot(p3, 5);

            var p1e = p1.add(p1.subtract(s).normalize().multiply(1000));
            var p3e = p3.add(p3.subtract(s).normalize().multiply(1000));
            var blocked = new Path();
            blocked.add(p1e);
            blocked.add(p1);
            blocked.add(p3);
            blocked.add(p3e);
            blocked.closed = true;
            // invis.push(blocked);
            // blocked.fillColor = 'grey';
            var p1dot = drawDot(p1e, 5);
            var p3dot = drawDot(p3e, 5);


*/