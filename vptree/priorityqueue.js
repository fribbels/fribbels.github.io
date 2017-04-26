'use strict';
//https://github.com/mourner/tinyqueue
function TinyQueue(data, compare) {
    if (!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

    this.data = data || [];
    this.length = this.data.length;
    this.compare = compare || defaultCompare;

    if (this.length > 0) {
        for (var i = (this.length >> 1); i >= 0; i--) this._down(i);
    }
}

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

TinyQueue.prototype = {

    push: function (item) {
        this.data.push(item);
        this.length++;
        this._up(this.length - 1);
    },

    pop: function () {
        if (this.length === 0) return undefined;

        var top = this.data[0];
        this.length--;

        if (this.length > 0) {
            this.data[0] = this.data[this.length];
            this._down(0);
        }
        this.data.pop();

        return top;
    },

    peek: function () {
        return this.data[0];
    },

    last: function () {
        for (var i = this.data.length-1; i >= 0; i--) {
            if (this.data[i] == undefined || this.data[i] == null)
                continue;
            return this.data[i];
        }
    },

    all: function () {
        return this.data;
    },

    _up: function (pos) {
        var data = this.data;
        var compare = this.compare;
        var item = data[pos];

        while (pos > 0) {
            var parent = (pos - 1) >> 1;
            var current = data[parent];
            if (compare(item, current) >= 0) break;
            data[pos] = current;
            pos = parent;
        }

        data[pos] = item;
    },

    _down: function (pos) {
        var data = this.data;
        var compare = this.compare;
        var halfLength = this.length >> 1;
        var item = data[pos];

        while (pos < halfLength) {
            var left = (pos << 1) + 1;
            var right = left + 1;
            var best = data[left];

            if (right < this.length && compare(data[right], best) < 0) {
                left = right;
                best = data[right];
            }
            if (compare(best, item) >= 0) break;

            data[pos] = best;
            pos = left;
        }

        data[pos] = item;
    }
};

class DistanceQueue {
    constructor(query, n) {
        this.query = query;
        this.n = n;

        this.arr = new Array(n);
        this.distances = new Array(n);
        for (var i = 0; i < n; i++) {
            this.arr[i] = null;
            this.distances[i] = Infinity;
        }
    }

    all() {
        return this.arr;
    }

    contains(val) {
        for (var i = 0; i < this.n; i++) {
            if (this.arr[i] == val)
                return true;
        }
        return false;
    }

    last() {
        for (var i = this.n-1; i >= 0; i--) {
            if (this.arr[i] != undefined && this.arr[i] != null)
                return this.arr[i];
        }

        return undefined;
    }

    push(elem) {
        var dist = elem.distance(this.query);
        var i;
        var tempDist;
        var tempElem;
        for (i = 0; i < this.n; i++) {
            if (this.distances[i] == undefined || dist < this.distances[i]) {
                tempDist = this.distances[i];
                tempElem = this.arr[i];
                this.distances[i] = dist;
                this.arr[i] = elem;
                break;
            }
        }

        var j;
        for (j = i+1; j < this.n; j++) {
            if (this.arr[j] == undefined) {
                this.arr[j] = tempElem;
                this.distances[j] = tempDist;
                break;
            }
            var tD = this.distances[j];
            var tE = this.arr[j];
            this.distances[j] = tempDist;
            this.arr[j] = tempElem;
            tempDist = tD;
            tempElem = tE;
        }
    }
}


function PriorityQueue(size) {
    size = size || 1;
    var contents = [];

    function binaryIndexOf(priority) {
        var minIndex = 0,
            maxIndex = contents.length - 1,
            currentIndex,
            currentElement;

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) >> 1;
            currentElement = contents[currentIndex].priority;
             
            if (currentElement < priority) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement > priority) {
                maxIndex = currentIndex - 1;
            }
            else {
                return currentIndex;
            }
        }

        return -1 - minIndex;
    }

    var api = {
        get length() {
            return contents.length;
        },

        insert: function(data, priority) {
            var index = binaryIndexOf(priority);
            if (index < 0) index = -1 - index;
            if (index < size) {
                contents.splice(index, 0, {data: data, priority: priority});
                if (contents.length > size) {
                    contents.length--;
                }
            }
            return contents.length === size ? contents[contents.length-1].priority : undefined;
        },

        list: function() {
            return contents.map(function(item){ return {i: item.data, d: item.priority}; });
        }
    };

    return api;
}