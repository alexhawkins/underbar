/*jshint eqnull:true, expr:true*/
//var _ = require('underscore');
'use strict';
var _ = {};

(function() {

    // Returns whatever value is passed as the argument. This function doesn't
    // seem very useful, but remember it--if a function needs to provide an
    // iterator when the user does not pass one in, this will be handy.
    _.identity = function(val) {
        return val;
    };

    _.first = function(array, n) {
        return n === undefined ? array[0] : array.slice(0, n);
    };

    // Like first, but for the last elements. If n is undefined, return just the
    // last element.
    _.last = function(array, n) {
        if (n > array.length) {
            return array;
        } else
            return n === undefined ? array[array.length - 1] : array.slice(array.length - n, array.length);
    };


    _.each = function(collection, iterator) {
        if (Array.isArray(collection)) {
            for (var i = 0; i < collection.length; i++)
                iterator(collection[i], i, collection);
        } else if (collection instanceof Object) {
            for (var key in collection)
                iterator(collection[key], key, collection);
        } else if (collection === null) {
            return collection;
        }
    };

    // Returns the index at which value can be found in the array, or -1 if value
    // is not present in the array.
    _.indexOf = function(array, target) {
        var result = -1;
        _.each(array, function(el, index) {
            if (el === target && result === -1) {
                result = index;
            }
        });
        return result;
    };

    // Return all elements of an array that pass a truth test.
    _.filter = function(collection, test) {
        var arr = [];
        _.each(collection, function(el, index) {
            if (test(el, index)) {
                arr.push(el);
            }
        });
        return arr;
    };

    _.reject = function(collection, test) {
        return _.filter(collection, function(item) {
            return !test(item);
        });

    };

    // Produce a duplicate-free version of the array.
    _.uniq = function(array) {
        return _.filter(array, function(item, index) {
            if (_.indexOf(array, item) === index) return item;
        });
    };

    // Return the results of applying an iterator to each element.
    _.map = function(collection, iterator) {
        var arr = [];
        _.each(collection, function(el, index) {
            arr.push(iterator(el, index));
        });
        return arr;
    };

    _.pluck = function(collection, key) {
        return _.map(collection, function(obj) {
            return obj[key];
        });
    };

    // Calls the method named by functionOrKey on each value in the list.
    // Note: you will nead to learn a bit about .apply to complete this.
    _.invoke = function(collection, func, args) {
        return _.map(collection, function(el) {
            return (func instanceof Function) ? func.apply(el, args) : el[func].apply(el, args);
        });
    };

    _.reduce = function(collection, iterator, accum) {
        accum = accum === undefined ? _.first(collection) : accum;
        return _.last(_.map(collection, function(el) {
            return accum = iterator(accum, el);
        }));
    };

    // Determine if the array or object contains a given value (using `===`).
    _.contains = function(collection, target) {
        return _.reduce(collection, function(wasFound, item) {
            return wasFound ? true : item === target;
        }, false);
    };

    // Determine whether all of the elements match a truth test.
    _.every = function(collection, iterator) {
        if (collection.length === 0) return true;
        return _.reduce(collection, function(isTrue, el) {
            return iterator ? ((!isTrue) ? false : iterator(el) ? true : false) : el;
        }, true);
    };

    // Determine whether any of the elements pass a truth test. If no iterator is
    // provided, provide a default one
    _.some = function(collection, iterator) {
        iterator = iterator || _.identity;
        return !_.every(collection, function(el) {
            return !iterator(el);
        });
    };


    /**
     * OBJECTS
     * =======
     */

    _.extend = function(obj) {
        _.each(arguments, function(extension) {
            for (var key in extension)
                obj[key] = extension[key];
        });
        return obj;
    };

    // Like extend, but doesn't ever overwrite a key that already
    // exists in obj
    _.defaults = function(obj) {
        _.each(arguments, function(extend) {
            for (var key in extend) {
                if (!(key in obj)) obj[key] = extend[key];
            }
        });
        return obj;
    };

    /**
     * FUNCTIONS
     * =========
     *
     * Now we're getting into function decorators, which take in any function
     * and return out a new version of the function that works somewhat differently
     */

    // Return a function that can be called at most one time. Subsequent calls
    // should return the previously returned value.
    _.once = function(func) {
        // TIP: These variables are stored in a "closure scope" (worth researching),
        // so that they'll remain available to the newly-generated function every
        // time it's called.
        var alreadyCalled = false;
        var result;

        // TIP: We'll return a new function that delegates to the old one, but only
        // if it hasn't been called before.
        return function() {
            if (!alreadyCalled) {
                // TIP: .apply(this, arguments) is the standard way to pass on all of the
                // infromation from one function call to another.
                result = func.apply(this, arguments);
                alreadyCalled = true;
            }
            // The new function always returns the originally computed result.
            return result;
        };
    };

    // Memoize an expensive function by storing its results. You may assume
    // that the function takes only one argument and that it is a primitive.
    //
    // _.memoize should return a function that when called, will check if it has
    // already computed the result for the given argument and return that value
    // instead if possible.

    _.memoize = function(func) {
        var cache = {};
        return function() {
            var args = [].slice.call(arguments);
            return cache[args] = (args in cache) ? cache[args] : func.apply(this, args);
        };
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.

    _.delay = function(func, wait) {
        var args = [].slice.call(arguments, 2);
        setTimeout(function() {
            func.apply(null, args);
        }, wait);
    };
    /**
     * ADVANCED COLLECTION OPERATIONS
     * ==============================
     */

    // Randomizes the order of an array's contents.

    _.shuffle = function(array) {
        var clone = array.slice(0),
            pos, temp;
        for (var i = 0; i < clone.length; i++) {
            pos = Math.floor(Math.random() * clone.length);
            temp = clone[i];
            clone[i] = clone[pos];
            clone[pos] = temp;
        }
        return clone;
    };


    // Sort the object's values by a criterion produced by an iterator.
    // If iterator is a string, sort objects by that property with the name
    // of that string. For example, _.sortBy(people, 'name') should sort
    // an array of people by their name.

    _.sortBy = function(collection, iterator) {
        var isString = typeof iterator === 'string';
        return [].sort.call(collection, function(x, y) {
            return isString ? x[iterator] - y[iterator] : iterator(x) - iterator(y);
        });
    };

    /* LONG VERSION OF sortBy written out
    *****************************************************
    var sortBy = function(col, iterator) {

        var isString = typeof iterator === 'string',
            len = col.length,
            temp, lowest;

        _.each(col, function(_, index) {
            lowest = index;
            if (isString) {
                for (var i = index + 1; i < len; i++) {
                    if (col[i][iterator] < col[lowest][iterator])
                        lowest = i;
                }
            } else {
                for (var i = index + 1; i < len; i++) {
                    if (iterator(col[i]) < iterator(col[lowest]) || col[lowest] === undefined)
                        lowest = i;
                }
            }

            if (index != lowest) {
                temp = col[index];
                col[index] = col[lowest];
                col[lowest] = temp;
            }
        });

        return col;
    };
    */

    _.zip = function() {
        var longest = [].sort.call(arguments, function(x, y) {
                return y.length - x.length;
            })[0].length,
            zipped = [];
        for (var i = 0; i < longest; i++)
            zipped[i] = _.pluck(arguments, i);
        return zipped;
    };

    // Takes a multidimensional array and converts it to a one-dimensional array.
    // The new array should contain all elements of the multidimensional array.
    //
    // Hint: Use Array.isArray to check if something is an array
    //non recursive 
    /*********FLATTEN**********/
    _.flatten = function(nestedArray, result) {
        _.each(nestedArray, function(el) {
            if (Array.isArray(el))
                nestedArray = _.flatten([].concat.apply([], nestedArray));
        });
        return nestedArray;
    };
    /*********UNION**********/
    _.union = function() {
        return _.uniq(_.flatten(arguments));
    };
    // Takes an arbitrary number of arrays and produces an array that contains
    // every item shared between all the passed-in arrays.
    _.intersection = function() {
        var args = [].slice.call(arguments),
            argsLength = args.length - 1,
            checkAgainst = _.last(_.sortBy(args, 'length'), argsLength), //arrays to check
            mainVal = _.first(args), //get first array which should be shortest
            intersected = [];
        _.each(mainVal, function(val) {
            var totalCount = 0;
            _.each(checkAgainst, function(obj) {
                var count = 0;
                _.each(obj, function(el) {
                    if (el === val)
                        count++;
                });
                if (count > 0) totalCount++;
            });
            if (totalCount === argsLength) intersected.push(val);
        });
        return intersected;
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function(array) {
        var otherArgs = _.flatten([].slice.call(arguments, 1));
        return _.filter(array, function(el) {
            for (var i = 0; i < otherArgs.length; i++)
                if (el === otherArgs[i]) return false;
            return true;
        });
    };


    /**
     * MEGA EXTRA CREDIT
     * =================
     */

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    //
    // See the Underbar readme for details.
    _.throttle = function(func, wait) {};

}).call(this);
