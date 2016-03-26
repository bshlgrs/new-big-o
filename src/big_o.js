(function() {
  var BigO = window.BigO = {};

  var order = ["1", "log(n)", "n", "n log(n)", "n^2", undefined];

  var greaterThan = function(x, y) {
    return order.indexOf(x) > order.indexOf(y);
  };

  var add = function(x, y) {
    if (greaterThan(x, y)) {
      return x;
    } else {
      return y;
    }
  };

  var multiply = function(x, y) {
    if (x == "1") return y;
    if (y == "1") return x;
    if (x == "log(n)" && y == "n") return "n log(n)";
    if (x == undefined || y == undefined) return undefined;

    throw "Error: don't know how to multiply "+x+" and "+y;
  };

  var or = function (x, y) {
    if (greaterThan(x, y)) {
      return y;
    } else {
      return x;
    }
  };

  var operations = { "+": add, "*": multiply, "||": or};

  var evaluateCost = function(variables, expr) {
    if (order.indexOf(expr) != -1) {
      return expr;
    }
    if (typeof expr == "string") {
      if (variables[expr]) {
        return variables[expr];
      } else {
        return undefined;
      }
    } else {
      var lhs = evaluateCost(variables, expr[1][0]);
      var rhs = evaluateCost(variables, expr[1][1]);
      var op = operations[expr[0]];
      return op(lhs, rhs);
    }
  };

  BigO.getAllMethods = function (rules) {
    var listObject = {};

    rules.forEach((rule) => {
      getAllMethodNamesFromRule(rule).forEach((methodName) => {
        listObject[methodName] = true;
      });
    });

    return Object.keys(listObject);
  };

  var getAllMethodNamesFromRule = function (rule) {
    return [rule[0]].concat(getAllMethodNamesFromRuleExp(rule[1]));
  }

  var getAllMethodNamesFromRuleExp = function (rule) {
    if (order.indexOf(rule) != -1) {
      return [];
    }
    if (typeof rule == "string") {
      return [rule];
    } else {
      var lhs = getAllMethodNamesFromRuleExp(rule[1][0]);
      var rhs = getAllMethodNamesFromRuleExp(rule[1][1]);
      return lhs.concat(rhs);
    }
  };

  var ruleToString = function (rule) {
    debugger;
  }

  var makeEdgeMap = function (edges) {
    if (edgeMapCache[edges]) {
      return edgeMapCache[edges];
    }

    var edgeMap = {};

    var addToEdgeMap = function (edge, variable) {
      if (!edgeMap[variable]) edgeMap[variable] = [];

      edgeMap[variable].push(edge);
    }

    edges.forEach((edge) => {
      getAllMethodNamesFromRuleExp(edge[1]).forEach((name) => {
        addToEdgeMap(edge, name);
      })
    });

    edgeMapCache[edges] = edgeMap;
    return edgeMap;
  };

  var edgeMapCache = {};

  var isMutatingMethod = function (methodName) {
    return methodName[methodName.length - 1] == "$";
  };

  // MODIFIED DIJKSTRA'S ALGORITHM WOW
  BigO.searchMethods = function (startCosts, edges) {
    var pq = new BucketedPriorityQueue(order);

    var edgeMap = makeEdgeMap(edges);

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
          var alt = evaluateCost(settled, costFunction);

          if (greaterThan(pq.getPriority(v), alt)) {
            pq.changePriority(v, alt);
            sources[v] = edge;
          }
        }
      })
    }

    return { "costs": settled, "sources": sources };
  };

  var mergeMethodTimes = function (original, auxiliary) {
    var result = {};

    // copy original into result;
    Object.keys(original).forEach((methodName) => {
      result[methodName] = original[methodName];
    });

    Object.keys(auxiliary).forEach((methodName) => {
      if (!isMutatingMethod(methodName)) {
        result[methodName] = or(original[methodName], auxiliary[methodName]);
      }
    });

    return result;
  };

  var mergeAllGetMethods = function (structures) {
    var result = {};
    structures.forEach((x) => {
      result = mergeMethodTimes(result, x);
    });

    // TODO: include a list of what method came from where, somehow.

    return result;
  };

  BigO.methodTimesForCombinedStructures = function (structures, edges) {
    var mergedGet = mergeAllGetMethods(structures);

    var getMethodTimes = BigO.searchMethods(mergedGet, edges).costs;

    var allSetMethodTimes = structures.map((structure) => {
      var mergedMethods = mergeMethodTimes(structure, getMethodTimes);
      return BigO.searchMethods(mergedMethods, edges).costs;
    });


    var allMergedMethods = allSetMethodTimes[allSetMethodTimes.length - 1];
    allSetMethodTimes.pop();

    allSetMethodTimes.forEach((structure) => {
      Object.keys(structure).forEach((methodName) => {
        if (isMutatingMethod(methodName)) {
          allMergedMethods[methodName] = add(allMergedMethods[methodName], structure[methodName]);
        } else {
          allMergedMethods[methodName] = or(allMergedMethods[methodName], structure[methodName]);
        }
      });
    });

    Object.keys(allMergedMethods).forEach((methodName) => {
      if (!allMergedMethods[methodName]) {
        delete allMergedMethods[methodName];
      }
    });

    return allMergedMethods;
  };
})();

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
}
