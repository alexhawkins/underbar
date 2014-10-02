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
     *
     * In this section, we'll look at a couple of helpers for merging objects.
     */

    // Extend a given object with all the properties of the passed in
    // object(s).
    //
    // Example:
    //   var obj1 = {key1: "something"};
    //   _.extend(obj1, {
    //     key2: "something new",
    //     key3: "something else new"
    //   }, {
    //     bla: "even more stuff"
    //   }); // obj1 now contains key1, key2, key3 and bla
    _.extend = function(obj) {
        _.each(arguments, function(extendObj) {
            for (var key in extendObj)
                obj[key] = extendObj[key];
        });
        return obj;
    };

    // Like extend, but doesn't ever overwrite a key that already
    // exists in obj
    _.defaults = function(obj) {
        _.each(arguments, function(defaultsObj) {
            for (var key in defaultsObj) {
                //check to see if object key already exists
                //if it does, it won't return undefined. If the key
                //is undefined, add it to our object
                obj[key] === undefined ? obj[key] = defaultsObj[key] : 0;
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
        var memos = {};
        return function(arg) {
            if (arg in memos) {
                return memos[arg];
            } else {
                memos[arg] = func(arg);
                return memos[arg];
            }
        };
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    //
    // The arguments for the original function are passed after the wait
    // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
    // call someFunction('a', 'b') after 500ms
    _.delay = function(func, wait) {
        //get any extra agruments passed after the first two
        //use call method to call slice method on arguments objects which
        //only exists for objects of prototype Array without using call.
        var args = Array.prototype.slice.call(arguments, 2);
        //wait a few seconds to apply our function with those args
        setTimeout(function() {
            func.apply(null, args);
        }, wait);
    };


    /**
     * ADVANCED COLLECTION OPERATIONS
     * ==============================
     */

    // Randomizes the order of an array's contents.
    //
    // TIP: This function's test suite will ask that you not modify the original
    // input array. For a tip on how to make a copy of an array, see:
    // http://mdn.io/Array.prototype.slice
    _.shuffle = function(array) {
        var arrayClone = array.slice(); //clone array using slice method
        for (var i = 0, temp, pos; i < array.length; i++) {
            //create a random position from 0 to length of array. Floor our 
            //random position to ensure it is never larger than 1 minus
            //the length of our array to account for the indexing of arrays at position 0.
            pos = Math.floor(Math.random() * array.length);
            temp = arrayClone[i]; //store current element in temporary array;
            arrayClone[i] = arrayClone[pos]; //swap current element with random element;
            arrayClone[pos] = temp; // replace random element with value of initial element stored in temp;
        }
        return arrayClone;
    };

    /**
     * Note: This is the end of the pre-course curriculum. Feel free to continue,
     * but nothing beyond here is required.
     */


    // Sort the object's values by a criterion produced by an iterator.
    // If iterator is a string, sort objects by that property with the name
    // of that string. For example, _.sortBy(people, 'name') should sort
    // an array of people by their name.

    _.sortBy = function(collection, iterator) {
        if (typeof iterator === 'string') {
            return collection.sort(function(x, y) {
                return x[iterator] - y[iterator];
            });
        } else if (typeof iterator === 'function') {
            return collection.sort(function(x, y) {
                return iterator(x) - iterator(y);
            });
        }
    };

    // Zip together two or more arrays with elements of the same index
    // going together.
    //
    // Example:
    // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
    _.zip = function() {
        var arr = [],
            zipped = [];
        //get length of longest array so we know how many times to iterate
        var len = [].sort.call(arguments, function(x, y) {
            return y.length - x.length;
        })[0].length;
        for (var i = 0; i < len; i++) {
            _.each(arguments, function(arg) {
                arr.push(arg[i]);
            });
            zipped.push(arr);
            arr = [];
        }
        return zipped;
    };

    // Takes a multidimensional array and converts it to a one-dimensional array.
    // The new array should contain all elements of the multidimensional array.
    //
    // Hint: Use Array.isArray to check if something is an array
    //non recursive 
    _.flatten = function(arr) {
        var arrayExists = true;
        while (arrayExists) {
            arrayExists = false;
            _.each(arr, function(el) {
                if (Array.isArray(el))
                    arrayExists = true;
            });
            arr = Array.prototype.concat.apply([], arr);
        }
        return arr;
    };

    // Takes an arbitrary number of arrays and produces an array that contains
    // every item shared between all the passed-in arrays.
    _.intersection = function() {
        var intersected = [];
        var firstArg = ([].slice.call(arguments, 0, 1))[0]; //get first argument
        var lastArgs = [].slice.call(arguments, 1); //get last args after first
        _.each(firstArg, function(checkAgainst) {
            var count = 0;
            _.each(lastArgs, function(arg) {
                _.each(arg, function(el) {
                    if (el === checkAgainst)
                        count++;
                });
            });
            count >= lastArgs.length ? intersected.push(checkAgainst) : 0;
        });
        return intersected;
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function() {
        var uniqNumbers = [];
        var firstArg = [].slice.call(arguments, 0, 1)[0];
        var nextArgs = [].slice.call(arguments, 1);
        _.each(firstArg, function(checkVal) {
            var doesNotExist = true;
            _.each(nextArgs, function(el) {
                _.each(el, function(number) {
                    if (number === checkVal)
                        doesNotExist = false;
                });
            });
            doesNotExist ? uniqNumbers.push(checkVal) : 0;
        });
        return uniqNumbers;
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
