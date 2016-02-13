var BigO = window.BigO = {
  order: ["1", "log(n)", "n", "n log(n)", "n^2", undefined],
  greaterThan: function(x, y) {
    return BigO.order.indexOf(x) > BigO.order.indexOf(y);
  },
  add: function(x, y) {
    if (BigO.greaterThan(x, y)) {
      return x;
    } else {
      return y;
    }
  },
  multiply: function(x, y) {
    if (x == "1") return y;
    if (y == "1") return x;
    if (x == "log(n)" && y == "n") return "n log(n)";
    if (x == undefined || y == undefined) return undefined;

    throw "Error: don't know how to multiply "+x+" and "+y;
  },
  or: function (x, y) {
    if (BigO.greaterThan(x, y)) {
      return y;
    } else {
      return x;
    }
  },
  operations: { "+": "add", "*": "multiply", "||": "or"},
  evaluateCost(variables, expr) {
    if (BigO.order.indexOf(expr) != -1) {
      return expr;
    }
    if (typeof expr == "string") {
      if (variables[expr]) {
        return variables[expr];
      } else {
        return undefined;
      }
    } else {
      var lhs = BigO.evaluateCost(variables, expr[1][0]);
      var rhs = BigO.evaluateCost(variables, expr[1][1]);
      var op = BigO.operations[expr[0]];
      return BigO[op](lhs, rhs);
    }
  },
  getAllMethodNamesFromRule(rule) {
    if (BigO.order.indexOf(rule) != -1) {
      return [];
    }
    if (typeof rule == "string") {
      return [rule];
    } else {
      var lhs = BigO.getAllMethodNamesFromRule(rule[1][0]);
      var rhs = BigO.getAllMethodNamesFromRule(rule[1][1]);
      return lhs.concat(rhs);
    }
  },
  makeEdgeMap(edges) {
    var edgeMap = {};

    var addToEdgeMap = function (edge, variable) {
      if (!edgeMap[variable]) edgeMap[variable] = [];

      edgeMap[variable].push(edge);
    }

    edges.forEach((edge) => {
      BigO.getAllMethodNamesFromRule(edge[1]).forEach((name) => {
        addToEdgeMap(edge, name);
      })
    });

    return edgeMap;
  },

  // MODIFIED DIJKSTRA'S ALGORITHM WOW
  searchMethods(startCosts, edges) {
    var pq = new BucketedPriorityQueue(BigO.order);

    var edgeMap = BigO.makeEdgeMap(edges);

    var settled = {};
    var sources = {};

    Object.keys(startCosts).forEach((v) => {
      pq.add(v, startCosts[v]);
    });

    while (pq.getCount()) {
      var u = pq.peekMin();

      settled[u] = pq.getPriority(u);
      pq.remove(u);

      (edgeMap[u] || []).forEach((edge) => {
        var v = edge[0];
        if (settled[v] == undefined) {
          var costFunction = edge[1];
          var alt = BigO.evaluateCost(settled, costFunction);

          if (BigO.greaterThan(pq.getPriority(v), alt)) {
            pq.changePriority(v, alt);
            sources[v] = edge;
          }
        }
      })
    }

    return settled;
  }
};

class BucketedPriorityQueue {
  // constructor
  constructor(bucketList) {
    this.bucketList = bucketList;
    this.buckets = {};
    bucketList.forEach((x) => {
      this.buckets[x] = {};
    });
    this.directory = {};
    this.count = 0;
  }

  add(key, value) {
    this.directory[key] = value;
    this.buckets[value][key] = true;
    this.count += 1;
  }

  remove(key) {
    var currentValue = this.directory[key];

    if (currentValue) {
      delete this.buckets[currentValue][key];
      this.count -= 1;
    }
  }

  changePriority(key, value) {
    this.remove(key);
    this.add(key, value);
  }

  contains(key) {
    return !!this.directory[key];
  }

  getPriority(key) {
    return this.directory[key];
  }

  peekMin() {
    for(var x = 0; x < this.bucketList.length; x++) {
      var keys = Object.keys(this.buckets[this.bucketList[x]]);
      if (keys.length) {
        var min = keys[0];
        return min;
      }
    }

    throw "peeking but nothing is there";
  }

  getCount() {
    return this.count;
  }
};
