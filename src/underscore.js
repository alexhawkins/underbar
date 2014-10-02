'use strict';
var _ = {};


/*********IDENTITY**********/
_.identity = function(val) {
    return val;
};

/*********FIRST**********/
_.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
};

/*********LAST**********/
_.last = function(array, n) {
    if (n > array.length) {
        return array;
    } else
        return n === undefined ? array[array.length - 1] : array.slice(array.length - n, array.length);
};

/*********EACH**********/
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

/*********INDEXOF**********/
_.indexOf = function(array, target) {
    var result = -1;
    _.each(array, function(el, index) {
        if (el === target && result === -1) {
            result = index;
        }
    });
    return result;
};

/*********FILTER**********/
_.filter = function(collection, test) {
    var arr = [];
    _.each(collection, function(el, index) {
        if (test(el, index)) {
            arr.push(el);
        }
    });
    return arr;
};

/*********REJECT**********/
_.reject = function(collection, test) {
    return _.filter(collection, function(item) {
        return !test(item);
    });

};

/*********UNIQ**********/
_.uniq = function(array) {
    return _.filter(array, function(item, index) {
        if (_.indexOf(array, item) === index) return item;
    });
};


/*********MAP**********/
_.map = function(collection, iterator) {
    var arr = [];
    _.each(collection, function(el, index) {
        arr.push(iterator(el, index));
    });
    return arr;
};

/*********PLUCK**********/
_.pluck = function(collection, key) {
    return _.map(collection, function(obj) {
        return obj[key];
    });
};

/*********INVOKE*********/
_.invoke = function(collection, func, args) {
    return _.map(collection, function(el) {
        return (func instanceof Function) ? func.apply(el, args) : el[func].apply(el, args);
    });
};

/*********REDUCE**********/
_.reduce = function(collection, iterator, accum) {
    accum = accum === undefined ? _.first(collection) : accum;
    return _.last(_.map(collection, function(el) {
        return accum = iterator(accum, el);
    }));
};

/*********CONTAINS*********/
_.contains = function(collection, target) {
    return _.reduce(collection, function(wasFound, item) {
        return wasFound ? true : item === target;
    }, false);
};

/*********EVERY**********/
_.every = function(collection, iterator) {
    if (collection.length === 0) return true;
    return _.reduce(collection, function(isTrue, el) {
        return iterator ? ((!isTrue) ? false : iterator(el) ? true : false) : el;
    }, true);
};

/********SOME**********/
_.some = function(collection, iterator) {
    iterator = iterator || _.identity;
    return !_.every(collection, function(el) {
        return !iterator(el);
    });
};

/*********EXTEND**********/
_.extend = function(obj) {
    _.each(arguments, function(extendObj) {
        for (var key in extendObj)
            obj[key] = extendObj[key];
    });
    return obj;
};

/*********DEFAULTS**********/
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

/*********ONCE**********/
_.once = function(func) {
    var alreadyCalled = false;
    var result;
    return function() {
        if (!alreadyCalled) {
            result = func.apply(this, arguments);
            alreadyCalled = true;
        }
        return result;
    };
};

/*********DELAY*********/
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


/*********SHUFFLE**********/
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

/*********SORTBY**********/
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

/*********ZIP**********/
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

/*********FLATTEN**********/
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

/*********INTERSECTION**********/
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

/*********DIFFERENCE**********/
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
