
//_____________________________________________________________________________
// Bounded priority queue class  --  used in k-NN search

function BPQ(capacity) {
  this.capacity = capacity;
  this.elements = [];
}

BPQ.prototype.isFull = function() { 
  return this.elements.length === this.capacity; 
};

BPQ.prototype.isEmpty = function() { 
  return this.elements.length === 0; 
};

BPQ.prototype.maxPriority = function() {
  return this.elements[this.elements.length - 1].priority;
};

Object.defineProperty(BPQ.prototype, "values", {
  get: function() { return this.elements.map(function(d) { return d.value; }); }
});

// TODO: make more efficient?
BPQ.prototype.add = function(value, priority) {

  var q = this.elements,
      d = { value: value, priority: priority };
  if (this.isEmpty()) { q.push(d); } 
  else {
    for (var i = 0; i < q.length; i++) {
      if (priority < q[i].priority) {
        q.splice(i, 0, d);
        break;
      }
      else if ( (i == q.length-1) && !this.isFull() ) {
        q.push(d);
      }
    }
  }
  this.elements = q.slice(0, this.capacity);
};

//______________________________________________________________________________
// Node class  --  defines each node in the k-d tree

function Node(location, axis, subnodes, datum, median) {
  this.location = location;
  this.axis = axis;
  this.subnodes = subnodes;  // = children nodes = [left child, right child]
  this.datum = datum;
  this.median = median;
};

Node.prototype.toArray = function() {
  var array = [
    this.location, 
    this.subnodes[0] ? this.subnodes[0].toArray() : null, 
    this.subnodes[0] ? this.subnodes[1].toArray() : null
  ];
  array.axis = this.axis;
  return array;
};

Node.prototype.flatten = function() {
  var left = this.subnodes[0] ? this.subnodes[0].flatten() : null,
      right = this.subnodes[1] ? this.subnodes[1].flatten() : null;
  return left && right ? [this].concat(left, right) :
        left ? [this].concat(left) :
        right ? [this].concat(right) :
        [this];
};

// k-NN search
Node.prototype.find = function(target, k) {
  k = k || 1;
  
  var queue = new BPQ(k),
      scannedNodes = [];
  
  search(this);
  
  return {
    nearestNodes: queue.values,
    scannedNodes: scannedNodes,
    iterations: scannedNodes.length,
    maxDistance: queue.maxPriority()
  };
  
  // 1-NN algorithm outlined here:
  // http://web.stanford.edu/class/cs106l/handouts/assignment-3-kdtree.pdf
  function search(node) {
    if (node === null) return;
    
    scannedNodes.push(node);
    
    // Add current point to BPQ
    queue.add(node, distance(node.location, target));
    
    // Recursively search the half of the tree that contains the test point
    if (target[node.axis] < node.location[node.axis]) {
      // Check left
      search(node.subnodes[0]);
      var otherNode = node.subnodes[1];
    }
    else {
      // Check right
      search(node.subnodes[1]);
      var otherNode = node.subnodes[0];
    }
    
    // If candidate hypersphere crosses this splitting plane, look on the
    // other side of the plane by examining the other subtree
    var delta = Math.abs(node.location[node.axis] - target[node.axis]);
    if (!queue.isFull() || delta < queue.maxPriority()) {
      search(otherNode);
    }
  }
};

//______________________________________________________________________________
// k-d tree generator

function KDTree() {
  
  function tree(data) {
    var points = data.map(function(d) { 
      var point = [];
      for (var i = 0; i < d.length; i++) {
        point.push(d[i]);
      }
      point.datum = d;
      return point; 
    });
    
    return treeify(points, 0);
  }

  return tree;
  
  // Adapted from https://en.wikipedia.org/wiki/K-d_tree
  function treeify(points, depth) {
    try { var k = points[0].length; }
    catch (e) { return null; }
    
    // Select axis based on depth so that axis cycles through all valid values
    var axis = depth % k;
    
    // TODO: To speed up, consider splitting points based on approximation of
    //       median; take median of random sample of points (perhaps of 1/10th 
    //       of the points)
    
    // Sort point list and choose median as pivot element
    points.sort(function(a, b) { return a[axis] - b[axis]; });
    i_median = Math.floor(points.length / 2);
    var median = points[i_median];
    // Create node and construct subtrees
    var point = points[i_median],
        left_points = points.slice(0, i_median),
        right_points = points.slice(i_median + 1);
        
    var left = treeify(left_points, depth + 1);
    var right = treeify(right_points, depth + 1);
    var node = new Node(
      point,
      axis,
      [left, right],
      point.datum,
      median
    );
    if (left != null) 
      left.parent = node;
    if (right != null) 
      right.parent = node;
    return node;
  }
}


//______________________________________________________________________________
// Helper functions

function min(array, accessor) {
  return array
    .map(function(d) { return accessor(d); })
    .reduce(function(a, b) { return a < b ? a : b; });
}

function max(array, accessor) {
  return array
    .map(function(d) { return accessor(d); })
    .reduce(function(a, b) { return a > b ? a : b; });
}

function get(key) { return function(d) { return d[key]; }; }

// TODO: Make distance function work for k-dimensions

// Euclidean distance between two vectors
function distance(v0, v1) {
  var sum = 0;
  for (var i = 0; i < v0.length; i++) {
      sum += Math.pow(v1[i] - v0[i], 2);
  }
  return Math.sqrt(sum);
}
