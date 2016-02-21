"use strict";

/* key => value
 * value can be:
 *  - string (another key)
 *  - number
 *  - array of keys (they will be summed, same as {sum: [array]})
 *  - object: {operator: argument}
 *      - operator:
 *          - avg(array)
 *          - sum(array)
 *          - floor(value)
 *          - round(value)
 *      - argument: value or array of value
 */

/**
 * dependencyTree: an object describing the dependency tree and default values
 * bonuses: a hash map of integers describing attributes bonuses
 */

class Attributes {
  constructor(dependencyTree, bonuses) {
    this.tree = dependencyTree || {}; // attributes tree hash map
    this.bonuses = bonuses || {}; // attributes bonuses hash map
  }

  set(key, value) {
    var actual = this.get(key);
    var bonus = this.getBonus(key);
    var actualWithoutBonus = actual - bonus;
    this.bonuses[key] = value - actualWithoutBonus;
    return this;
  }

  get(key) {
    var value = this.tree[key];
    return this.resolve(value) + this.getBonus(key);
  }

  getBonus(key) {
    return this.bonuses[key] || 0;
  }

  resolve(value) {
    //detecting NaN
    if (value !== value) {
      throw "attribute does not support NaN";
    }

    if (!value) {
      return 0;
    }

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      return this.get(value);
    }

    if (value.constructor === Array) {
      return this.sum(value);
    }

    if (value.constructor === Object) {
      return this.resolveObj(value);
    }

    throw "unexpected value: " + JSON.stringify(value) + " with constructor: " + value.constructor;
  }

  resolveObj(obj) {
    var keys = Object.keys(obj);
    var length = keys.length;

    if (length > 1) {
      throw "Formulas must be single key";
    }

    if (length === 0) {
      return 0;
    }

    //length === 1
    var key = keys[0];
    var val = obj[key];
    switch (key) {
    case "avg":
      return this.avg(val);
    case "sum":
      return this.sum(val);
    case "floor":
      return this.floor(val);
    case "round":
      return this.round(val);
    default:
    }

    throw "unexpected key: " + key;
  }

  avg(arr) {
    var length = arr.length;

    if (!arr || arr.constructor !== Array) {
      throw "Formula avg only supports array";
    }

    if (length === 0) {
      return 0;
    }

    return this.sum(arr) / length;
  }

  sum(arr) {
    var self = this;

    if (!arr || arr.constructor !== Array) {
      throw "Formula sum only supports array";
    }

    return arr.reduce(function (total, value) {
      return total + self.resolve(value);
    }, 0);
  }

  floor(value) {
    return Math.floor(this.resolve(value));
  }

  round(value) {
    return Math.round(this.resolve(value));
  }

}

module.exports = Attributes;
