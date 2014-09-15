/*jshint eqnull:true, expr:true*/
//var _ = require('underscore');
var _ = {};

(function() {

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   *
   *
   * IMPORTANT NOTE!
   * ===========
   *
   * The .first function is implemented for you, to help guide you toward success
   * in your work on the following functions. Whenever you see a portion of the
   * assignment pre-completed, be sure to read and understand it fully before
   * you proceed. Skipping this step will lead to considerably more difficulty
   * implementing the sections you are responsible for.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  //console.log(_.first([2,4,32,3,3,3], 2));

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    return (n > array.length) ? array : n === undefined ? array[array.length - 1] : array.slice(array.length - n, array.length);
  };

  //console.log(_.last([2,4,32,3,56,78], 7));
  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    //check to see if our collection is an array
    if(Array.isArray(collection)){
      for(var i = 0; i < collection.length; i++){
        iterator(collection[i], i, collection);
      }
    }
    else {
      for (var key in collection){
        iterator(collection[key], key, collection); // pass each property to our callback
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var arr = [];
    for(var i = 0; i < collection.length; i++)
     if (test(collection[i], i, collection)) { arr.push(collection[i]); }
    
    return arr;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    // TIP: see if you can re-use _.filter() here, without simply
    // copying code in and modifying it
    var arr = [];
    arr = _.filter(collection, function(item) {
      return !test(item);
    });
    return arr;
  };
  console.log(_.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 === 0; }));
  console.log(_.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 === 0; }));

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
      // make sure there is only one index, duplicates will have
      // multiple indexes, we won't return those.
    return _.filter(array, function(el, index) { return array.indexOf(el) === index; }).sort(function(x,y) { return x - y; });
  };

  console.log(_.uniq([1,23,23,4,4,5,42,3,2,4,66,66,0,7,66,77,7,10,9,5,2,1]));


  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    var arr = [];
    if(Array.isArray(collection)){
      for(var i = 0; i < collection.length; i++)
        arr.push(iterator(collection[i], i, collection));
    } else {
      for (var key in collection)
        arr.push(iterator(collection[key], key, collection));
    }
    return arr;
  };

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(collection, function(item){
      return item[key];
    });
  };

  // Calls the method named by functionOrKey on each value in the list.
  // Note: you will nead to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
       //return _.map(collection, function(val){
       //  return functionOrKey.apply(val, args);
       //  });
      var arr = [];
        //check to see if function or method name provided
        var isFunc = typeof functionOrKey === 'function' ? true : false;
        for(var i = 0; i < collection.length; i++){
          arr.push((isFunc ? functionOrKey : collection[i][functionOrKey]).apply(collection[i], args));
      }
      return arr;
  };

    var reverse = function(){
      return this.split('').reverse().join('');
    };

    var upperCasedStrings = _.invoke(['dog', 'cat'], 'toUpperCase');
    var reversedStrings = _.invoke(['dog', 'cat'], reverse);
    console.log(reversedStrings);
    console.log(upperCasedStrings);

  // Reduces an array or object to a single value by repetitively calling
  // iterator(previousValue, item) for each item. previousValue should be
  // the return value of the previous iterator call.
  //
  // You can pass in an initialValue that is passed to the first iterator
  // call. If initialValue is not explicitly passed in, it should default to the
  // first element in the collection.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total +// should be 6 number;
  //   }, 0); 
  _.reduce = function(collection, iterator, accumulator) {
      accumulator = accumulator === undefined ? collection[0] : accumulator;
      _.each(collection, function(item){
         accumulator = iterator(item, accumulator) || item;
      });
      return accumulator;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // TIP: Try re-using reduce() here.
    var checkEvery = true;
    _.each(collection, function(el) {
        if (iterator) {
            if (!iterator(el)) checkEvery = false;
        } else {
            if (!el) checkEvery = false;
        }
    });
    return checkEvery;
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.
    iterator = iterator || _.identity;
    // TIP: There's a very clever way to re-use every() here
    return !_.every(collection, function(item) {
      return !iterator(item);
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
       _.each(arguments, function(extendObj){
          for(var key in extendObj)
            obj[key] = extendObj[key];
       });
       return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    _.each(arguments, function(defaultsObj){
      for(var key in defaultsObj){
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

  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait){
    //get any extra agruments passed after the first two
    //use call method to call slice method on arguments objects which
    //only exists for objects of prototype Array without using call.
    var args =  Array.prototype.slice.call(arguments, 2);
    //wait a few seconds to apply our function with those args
    setTimeout(function(){
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
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
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
        })
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
  _.throttle = function(func, wait) {
  };

}).call(this);
