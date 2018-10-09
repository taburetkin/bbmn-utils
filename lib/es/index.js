import _ from 'underscore';
import { BackboneView, BaseClass, Collection, MnObject, Model, Region, Router, extend, isClass, isCollection, isCollectionClass, isModel, isModelClass, isView, isViewClass } from 'bbmn-core';
import Mn from 'backbone.marionette';

var version = "1.0.3";

var ctors = _.reduce([Model, Collection, BackboneView, Router, MnObject, Region, BaseClass], function (ctors, ctor) {
	/* istanbul ignore next */
	if (_.isFunction(ctor)) {
		ctors.push(ctor);
	}
	return ctors;
}, []);

var tryGetFromMn = ['Application', 'AppRouter'];

_.each(tryGetFromMn, function (ClassName) {
	_.isFunction(Mn[ClassName]) && ctors.push(Mn[ClassName]);
});

function isKnownCtor(arg) {
	var isFn = _.isFunction(arg);
	var result = _(ctors).some(function (ctor) {
		return arg === ctor || arg.prototype instanceof ctor;
	});
	return isFn && result;
}

function betterResult() {
	var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var key = arguments[1];
	var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var context = opts.context,
	    args = opts.args,
	    checkAlso = opts.checkAlso,
	    force = opts.force;

	var defaultValue = opts.default;

	if (!_.isString(key) || key === '') {
		return;
	}

	var value = obj[key];

	if (value != null && (!_.isFunction(value) || isKnownCtor(value))) {
		return value;
	}

	if (force !== false && _.isFunction(value)) {
		value = value.apply(context || obj, args);
	}

	//let result = force !== false && _.isFunction(value) ? value.apply(context || obj, args) : value;

	if (value == null && _.isObject(checkAlso)) {
		var alsoOptions = _.omit(opts, 'checkAlso');
		value = betterResult(checkAlso, key, alsoOptions);
	}

	if (value == null && defaultValue != null) {
		value = defaultValue;
	}

	return value;
}

// camelCase('asd:qwe:zxc') -> asdQweZxc
// camelCase('asd:qwe:zxc', true) -> AsdQweZxc
function camelCase() {

	var text = void 0;
	var first = void 0;

	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	if (!args.length) return;else if (args.length == 1) {
		text = args[0];
	} else {
		if (_.isBoolean(args[args.length - 1])) {
			first = args.pop();
		}
		text = _.filter(args, function (chunk) {
			return chunk != null;
		}).join(':');
	}

	if (!text) return text;

	if (!_.isString(text)) return text.toString();
	text = text.replace(/:{2,}/gmi, ':');
	var splitter = first === true ? /(^|:)(\w)/gi : /(:)(\w)/gi;
	text = text.replace(splitter, function (match, prefix, text) {
		return text.toUpperCase();
	});
	if (!first) text = text.replace(/(^)(\w)/gi, function (match, prefix, text) {
		return text.toLowerCase();
	});
	return text;
}

function takeFirst(key) {
	if (!_.isString(key) || key === '') return;
	var value = void 0;

	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	_.some(args, function (arg) {
		if (!_.isObject(arg)) {
			return false;
		}

		if (key in arg) {
			value = arg[key];
			return true;
		}
	});
	return value;
}

function getModel(arg) {

	if (isModel(arg)) {
		return arg;
	}

	if (isView(arg)) {
		return arg.model;
	}
}

function getModel$1(arg) {
	return isView(arg) && arg;
}

function compareAB(a, b, func) {
	if (_.isArray(func)) {

		var result = 0;

		_(func).every(function (f) {
			result = compareAB(a, b, f);
			return result === 0;
		});

		return result;
	} else {
		if (_.isFunction(func)) {
			a = func.call(a, getModel(a), getModel$1(a));
			b = func.call(b, getModel(b), getModel$1(b));
		}

		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	}
}

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function comparator() {
	var result = 0;

	//for simple case (arg1, arg2, compare)

	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	if (args.length <= 3 && !_.isArray(args[0])) {

		return compareAB.apply(null, args);
	}
	//for complex cases ([arg1, arg2, compare], [], .... [])
	//each arguments should be an array
	else {

			_(args).every(function (single) {

				if (!_.isArray(single)) {
					return true;
				}
				result = compareAB.apply(undefined, toConsumableArray(single));
				return result === 0;
			});
		}

	return result;
}

function toNumber(text) {

	if (_.isNumber(text) && !_.isNaN(text)) {
		return text;
	} else if (text == null || !_.isString(text)) {
		return;
	}

	var value = parseFloat(text, 10);

	if (isNaN(value)) {
		return;
	}

	return value;
}

var defaultOptions = {
	nullable: true,
	strict: false,
	returnNullAs: undefined,
	returnEmptyAs: undefined,
	returnNullAndEmptyAs: undefined,
	returnAnyAs: undefined,
	returnOtherAs: undefined
};

var trueValues = ['true', '1', '-1', 'yes'];
var falseValues = ['false', '0', 'no'];

var alternative = function alternative() {
	var returnValue = void 0;

	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	_(args).some(function (arg) {
		if (_.isBoolean(arg)) {
			returnValue = arg;
			return true;
		}
	});
	return returnValue;
};

var valueOrAlternative = function valueOrAlternative(nullable, nullValue, value) {
	for (var _len2 = arguments.length, alts = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
		alts[_key2 - 3] = arguments[_key2];
	}

	var alt = alternative.apply(undefined, alts);
	if (alt != null) return alt;else if (nullable) return nullValue;else return value;
};

var convertToBoolean = function convertToBoolean(arg) {
	var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


	var other = void 0;
	var options = _.extend({}, defaultOptions, opts);
	var nullable = options.nullable,
	    strict = options.strict,
	    returnNullAs = options.returnNullAs,
	    returnEmptyAs = options.returnEmptyAs,
	    returnNullAndEmptyAs = options.returnNullAndEmptyAs,
	    returnAnyAs = options.returnAnyAs,
	    returnOtherAs = options.returnOtherAs;


	if (arg == null) {
		return valueOrAlternative(nullable, undefined, false, returnNullAs, returnNullAndEmptyAs);
	} else if (arg === '') {
		return valueOrAlternative(nullable, undefined, false, returnEmptyAs, returnNullAndEmptyAs);
	} else if (_.isBoolean(arg)) {
		return arg;
	}
	//  else if (_.isObject(arg)) {
	// }

	other = strict ? nullable ? undefined : false : true;

	var text = arg.toString().toLowerCase();
	var isTrue = convertToBoolean.trueValues.indexOf(text) > -1;
	var isFalse = convertToBoolean.falseValues.indexOf(text) > -1;

	if (_.isBoolean(returnAnyAs)) {
		return returnAnyAs;
	} else if (_.isBoolean(returnOtherAs)) {
		other = returnOtherAs;
	}

	return isTrue ? true : isFalse ? false : other;
};

convertToBoolean.trueValues = trueValues;
convertToBoolean.falseValues = falseValues;

var converters = {
	number: toNumber,
	boolean: convertToBoolean,
	bool: convertToBoolean
};

//this is under development yet and can be change in any time
function convertString(text, type, opts) {

	if (!_.isString(type)) {
		throw new Error('type should be a string');
	}

	var converter = converters[type];

	if (!_.isFunction(converter)) {
		throw new Error('string converter ' + type + ' is not a function');
	}

	return converter(text, opts);
}

var privateApi = {
	traverse: function traverse(source) {
		var destination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';


		if (!_.isObject(source) || source === global) {
			return;
		}

		var hash = isModel(source) ? source.attributes : source;

		var props = Object.getOwnPropertyNames(hash);

		for (var x = 0; x < props.length; x++) {
			var name = props[x];
			var prop = hash[name];
			if (prop === undefined) {
				continue;
			} else if (_.isArray(prop)) {
				destination[root + name] = prop.slice(0);
			} else if (_.isDate(prop)) {
				destination[root + name] = new Date(prop.valueOf());
			} else if (!_.isObject(prop)) {
				destination[root + name] = prop;
			} else {
				privateApi.traverse(prop, destination, root + name + '.');
			}
		}

		return destination;
	}
};

function flattenObject(obj) {
	if (_.isObject(obj)) {
		return privateApi.traverse(obj);
	}
}

function getProperty(context, name) {
	if (context == null || !_.isObject(context) || name == null || name == '') return;
	if (isModel(context)) return context.get(name, { gettingByPath: true });else return context[name];
}

function getByPathArray(context, propertyName, pathArray) {

	if (context == null || !_.isObject(context) || propertyName == null || propertyName == '') return;

	var prop = getProperty(context, propertyName);

	if (!pathArray.length || pathArray.length && prop == null) return prop;

	var nextName = pathArray.shift();

	return getByPathArray(prop, nextName, pathArray);
}

function getByPath(obj, path) {

	if (obj == null || !_.isObject(obj) || path == null || path == '') return;

	var pathArray = _.isString(path) ? path.split('.') : _.isArray(path) ? [].slice.call(path) : [path];

	var prop = pathArray.shift();

	return getByPathArray(obj, prop, pathArray);
}

function getOption() {
	var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var key = arguments[1];
	var opts = arguments[2];
	var also = arguments[3];


	if (_.isObject(key) && _.isString(opts)) {
		var _opts = also;
		also = key;
		key = opts;
		opts = _opts;
	}

	var options = _.extend({ args: [context], context: context }, opts, { default: null });
	var deep = options.deep;

	var defaultValue = opts && opts.default;

	var value = betterResult(context.options || also, key, options);
	if (value == null && deep !== false) {
		value = betterResult(context, key, options);
	}

	return value != null ? value : defaultValue;
}

function instanceGetOption() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return getOption.apply(undefined, [this].concat(args));
}

function isEmptyValue(arg) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$allowWhiteSpace = _ref.allowWhiteSpace,
	    allowWhiteSpace = _ref$allowWhiteSpace === undefined ? false : _ref$allowWhiteSpace;

	if (arg == null || _.isNaN(arg)) return true;

	if (!_.isString(arg)) return false;

	if (arg === '') return true;

	return !allowWhiteSpace && arg.trim() === '';
}

function normalizeStringArray(arr) {
	return _.reduce(arr, function (result, item) {

		if (isEmptyValue(item)) {
			return result;
		}

		result.push(item.toString());
		return result;
	}, []);
}

function normalizeArgument(value, options, returnObject) {

	if (_.isString(value)) {
		value = value.split(/\s*,\s*/gmi);
	}

	if (_.isArray(value)) {
		return normalizeStringArray(value, options);
	} else if (_.isObject(value) && returnObject) {
		return value;
	}
}

function normalizeValueAndFlag(value, flag, options) {
	return {
		values: normalizeArgument(value, options, true),
		flags: normalizeArgument(flag, options)
	};
}

function compare(a, b, _ref) {
	var caseSensitive = _ref.caseSensitive;


	if (!caseSensitive) {
		a = a.toLowerCase();
		b = b.toLowerCase();
	}

	return a === b;
}

function searchFlags(values, flags, options) {
	var isArray = _.isArray(values);
	var useObjectValues = options.useObjectValues;


	var result = _.reduce(values, function (filtered, item, key) {
		var check = item;
		if (!isArray && !useObjectValues) {
			check = key;
		}

		var good = _.some(flags, function (flag) {
			return compare(check, flag, options);
		});

		if (!good) {
			return filtered;
		}

		if (isArray) {
			filtered.push(check);
		} else {
			filtered.push({ value: item, key: key });
		}

		return filtered;
	}, []);

	var all = options.all;
	if (!result.length || all && result.length != values.length) {
		return;
	}

	return result;
}

var processReturns = {
	string: function string(_ref) {
		var isArray = _ref.isArray,
		    founded = _ref.founded,
		    delimeter = _ref.delimeter,
		    takeObjectKeys = _ref.takeObjectKeys;

		if (isArray) {
			return founded.join(delimeter);
		} else {
			var key = takeObjectKeys ? 'key' : 'value';
			return _.pluck(founded, key).join(delimeter);
		}
	},
	array: function array(_ref2) {
		var isArray = _ref2.isArray,
		    doNotPluck = _ref2.doNotPluck,
		    founded = _ref2.founded,
		    takeObjectKeys = _ref2.takeObjectKeys;

		if (isArray || doNotPluck) {
			return founded;
		} else {
			var key = takeObjectKeys ? 'key' : 'value';
			return _.pluck(founded, key);
		}
	},
	object: function object(_ref3) {
		var isArray = _ref3.isArray,
		    takeObjectKeys = _ref3.takeObjectKeys,
		    founded = _ref3.founded;

		return _.reduce(founded, function (result, item, index) {
			var value = isArray ? item : takeObjectKeys ? item.key : item.value;
			var key = isArray ? index : takeObjectKeys ? item.value : item.key;
			result[key] = value;
			return result;
		}, {});
	}
};

function normalizedReturn(_ref4) {
	var returnAs = _ref4.returnAs,
	    flag = _ref4.flag,
	    isArray = _ref4.isArray,
	    founded = _ref4.founded,
	    delimeter = _ref4.delimeter,
	    takeObjectKeys = _ref4.takeObjectKeys,
	    doNotPluck = _ref4.doNotPluck;

	if (returnAs == null) {
		returnAs = _.isArray(flag) ? 'array' : 'string';
	}
	var processor = processReturns[returnAs];
	if (!_.isFunction(processor)) {
		return;
	}

	var processorOptions = {
		isArray: isArray, founded: founded, delimeter: delimeter, takeObjectKeys: takeObjectKeys, doNotPluck: doNotPluck
	};

	return processor(processorOptions);
}

function getFlag(value, flag) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var _normalizeValueAndFla = normalizeValueAndFlag(value, flag, options),
	    flags = _normalizeValueAndFla.flags,
	    values = _normalizeValueAndFla.values;

	if (!flags || !values) {
		return;
	}

	var founded = searchFlags(values, flags, options);
	if (!founded) {
		return;
	}

	var returnOptions = _.extend({
		delimeter: ', ',
		isArray: _.isArray(values),
		flag: flag,
		founded: founded
	}, _.pick(options, 'returnAs', 'takeObjectKeys', 'doNotPluck'));

	return normalizedReturn(returnOptions);
}

function hasFlag(value, flag) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


	if (value == null || flag == null) return false;

	if (_.isNumber(value)) {

		if (!_.isNumber(flag)) return false;

		var has = value & flag;
		return options.all === true ? has === flag : has > 0;
	}

	var _normalizeValueAndFla = normalizeValueAndFlag(value, flag, options),
	    flags = _normalizeValueAndFla.flags,
	    values = _normalizeValueAndFla.values;

	if (!flags || !values) {
		return false;
	}

	var founded = searchFlags(values, flags, options);
	return !!founded && !!founded.length;
}

var defaultOptions$1 = {
	mergeObjects: true,
	wrapObjectWithConstructor: true
};

function createMixinFromObject(arg) {

	var mixedObj = _.clone(arg);
	var ctor = mixedObj.hasOwnProperty('constructor') && _.isFunction(mixedObj.constructor) && mixedObj.constructor;
	var hasConstructor = _.isFunction(ctor);

	return function (Base) {
		if (hasConstructor) {
			mixedObj.constructor = function mx() {
				Base.apply(this, arguments);
				ctor.apply(this, arguments);
			};
		}
		return Base.extend(mixedObj);
	};
}

function normalizeArguments(args, opts) {
	var raw = {};
	var wrap = opts.wrapObjectWithConstructor == true;
	var merge = opts.mergeObjects == true;
	var mixins = [];
	_(args).each(function (arg) {

		//if argument is function just put it to mixins array
		//and continue;
		if (_.isFunction(arg)) {
			mixins.push(arg);
			return;
		}

		//if argument is not an object just skip it
		if (!_.isObject(arg)) return;

		//if mergeObjects == false or wrapObjectWithConstructor == true 
		//and there is a constructor function
		//converting to a mixin function
		//otherwise extend rawObject
		if (!merge || wrap && _.isFunction(arg.constructor)) {
			mixins.push(createMixinFromObject(arg));
		} else {
			_.extend(raw, arg);
		}
	});

	//if rawObject is not empty
	//convert it to a mixin function
	//and put it to the begin of mixins array
	if (_.size(raw)) mixins.unshift(createMixinFromObject(raw));

	return mixins;
}

function withMethod() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var mixins = normalizeArguments(args, this.options);
	var Mixed = this.class;
	if (!mixins.length) {
		return Mixed;
	} else {
		return _.reduce(mixins, function (Memo, Ctor) {
			var mixed = Ctor(Memo);
			return mixed;
		}, Mixed);
	}
}

function mix(_ctor, options) {

	var opts = _.extend({}, defaultOptions$1, options);

	var ctor = void 0;

	if (_.isFunction(_ctor)) {
		ctor = _ctor;
	} else if (_.isObject(_ctor)) {
		var b = _.isFunction(_ctor.constructor) && _ctor.constructor;
		ctor = function mx() {
			b.apply(this, arguments);
		};
		_.extend(ctor.prototype, _.omit(_ctor, 'constructor'));
	} else {
		throw new Error('Mix argument should be a class or a plain object');
	}

	if (!_.isFunction(ctor.extend)) {
		ctor.extend = extend;
	}

	return {
		options: opts,
		with: withMethod,
		class: ctor
	};
}

function pstoSetPair(context, pair, options) {
	if (!_.isString(pair) || pair === '') return;

	var keyvalue = pair.split('=');
	var key = keyvalue.shift();
	var value = keyvalue.join('=');
	pstoSetKeyValue(context, key, value, options);
}

function pstoSetKeyValue(context, key, value, options) {

	if (isEmptyValue(key) || isEmptyValue(value)) return;

	key = decodeURIComponent(key);
	value = decodeURIComponent(value);

	var transform = options.transform;
	if (_.isFunction(transform)) {
		value = transform(key, value, options);
	}

	if (!(key in context)) {
		context[key] = value;
		return value;
	}

	if (!_.isArray(context[key])) {
		context[key] = [context[key]];
	}

	context[key].push(value);

	return context[key];
}

function paramsToObject(raw) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var emptyObject = options.emptyObject !== false;
	var result = {};
	if (!_.isString(raw)) return emptyObject ? result : raw;

	var pairs = raw.split('&');
	_(pairs).each(function (pair) {
		return pstoSetPair(result, pair, options);
	});

	if (!_.size(result) && !emptyObject) {
		return raw;
	}

	return result;
}

function setProperty(context, name, value) {
	if (isModel(context)) {
		context.set(name, value, { silent: true });
	} else {
		context[name] = value;
	}

	return getProperty(context, name);
}

function setByPathArr(context, propertyName, pathArray, value, options) {

	var modelContext = void 0;
	if (isModel(context)) {
		modelContext = {
			model: context,
			property: propertyName,
			pathChunks: [].slice.call(pathArray)
		};
	}

	//set value if this is a last chunk of path
	if (!pathArray.length) {

		modelContext && options.models.push(modelContext);

		return {
			value: setProperty(context, propertyName, value, options)
		};
	} else {

		var prop = getProperty(context, propertyName);

		if (!_.isObject(prop) && !options.force) {
			return;
		} else if (!_.isObject(prop) && options.force) {
			prop = setProperty(context, propertyName, {}, options);
		}

		modelContext && options.models.push(modelContext);

		var nextName = pathArray.shift();

		return setByPathArr(prop, nextName, pathArray, value, options);
	}
}

function normalizeSetByPathOptions() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var ext = arguments[1];
	var silent = opts.silent,
	    force = opts.force;

	silent = silent === true;
	force = force !== false;
	var options = _.extend({}, opts, ext, {
		silent: silent, force: force,
		models: []
	});

	return options;
}

function triggerModelEventsOnSetByPath(value, options) {
	if (options.silent || !options.models.length) {
		return;
	}

	_(options.models).each(function (context) {
		var rest = context.pathChunks.join(':');
		if (rest) {
			context.model.trigger('change:' + context.property + ':' + rest, context.model, value);
		}
		context.model.trigger('change:' + context.property, context.model, value);
		context.model.trigger('change', context.model);
	});
}

function ensureSetByPathArguments(context, path) {
	var errors = [];
	if (!_.isObject(context)) {
		errors.push(new Error('Context is not an object'));
	}
	if (!_.isString(path) || path === '') {
		errors.push(new Error('Path is not a string'));
	}
	if (errors.length) {
		return errors;
	}
}

function setByPath(context, path, value, opts) {

	var argumentsErrors = ensureSetByPathArguments(context, path);
	if (argumentsErrors) {
		return value;
	}

	var pathArray = path.split('.');
	var options = normalizeSetByPathOptions(opts, { path: path, pathArray: [].slice.call(pathArray) });

	var propertyName = pathArray.shift();

	var result = setByPathArr(context, propertyName, pathArray, value, options);
	if (result === undefined) {
		return value;
	} else {
		triggerModelEventsOnSetByPath(value, options);
		return result.value;
	}
}

function unFlat(obj) {

	if (obj == null || !_.isObject(obj)) return;
	var res = {};
	for (var e in obj) {
		setByPath(res, e, obj[e]);
	}
	return res;
}

function check(arg, opts) {
	opts.ob += _.isObject(arg) && 1 || 0;
	opts.ar += _.isArray(arg) && 1 || 0;
	opts.fn += _.isFunction(arg) && 1 || 0;
	opts.sum += opts.ob + opts.ar + opts.fn;
}

function checkArguments(a, b) {
	var chck = { ob: 0, ar: 0, fn: 0, sum: 0 };
	check(a, chck);
	check(b, chck);
	return [chck.sum, chck.ob, chck.fn, chck.ar];
}

function compareObjects(objectA, objectB) {
	var _checkArguments = checkArguments(objectA, objectB),
	    _checkArguments2 = toArray(_checkArguments),
	    sum = _checkArguments2[0],
	    vals = _checkArguments2.slice(1);

	if (sum === 0) {
		return objectA == objectB;
	}
	if (!_.every(vals, function (val) {
		return val % 2 === 0;
	})) {
		return false;
	}

	var size = _.size(objectA);
	if (size != _.size(objectB)) {
		return false;
	}

	if (_.isArray(objectA)) {
		var allvalues = _.uniq(objectA.concat(objectB));
		return _.every(allvalues, function (value) {
			var valuesA = _.filter(objectA, function (_v) {
				return compareObjects(_v, value);
			});
			var valuesB = _.filter(objectB, function (_v) {
				return compareObjects(_v, value);
			});
			if (valuesA.length != valuesB.length) return false;
			return compareObjects(valuesA[0], valuesB[0]);
		});
	} else {
		var allkeys = _.uniq(_.keys(objectA).concat(_.keys(objectB)));
		if (allkeys.length != size) return false;
		return _.every(allkeys, function (key) {
			return compareObjects(objectA[key], objectB[key]);
		});
	}
}

function triggerMethodOn(context) {
	if (!_.isObject(context)) {
		return;
	}

	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	return triggerMethod.call.apply(triggerMethod, [context].concat(args));
}

function triggerMethod(event) {
	for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		args[_key2 - 1] = arguments[_key2];
	}

	// get the method name from the event name
	var methodName = camelCase('on:' + event);
	var method = getOption(this, methodName, { force: false });
	var result = void 0;

	// call the onMethodName if it exists
	if (_.isFunction(method)) {
		// pass all args, except the event name
		result = method.apply(this, args);
	}

	if (_.isFunction(this.trigger)) {
		// trigger the event
		this.trigger.apply(this, arguments);
	}

	return result;
}

function mergeOptions(options) {
	var _this = this;

	for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		keys[_key - 1] = arguments[_key];
	}

	if (!_.isObject(options)) {
		return;
	}

	keys = _.flatten(keys);

	return _.reduce(keys, function (merged, key) {
		if (!_.isString(key)) {
			return merged;
		}
		var option = options[key];

		if (option !== undefined) {
			_this[key] = option;
			merged[key] = option;
		}

		return merged;
	}, {});
}

function buildViewByKey(context, key) {
	var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	    TextView = _ref.TextView,
	    options = _ref.options;

	if (!_.isString(key)) {
		return;
	}

	var view = getOption(context, key, { args: [context] });
	var _options = getOption(context, key + 'Options', { args: [context] });

	if (TextView && _.isString(view)) {
		_options = _.extend({}, _options, { text: view });
		view = TextView;
	}
	options = _.extend({}, options, _options);

	if (isView(view)) {
		return view;
	} else if (isViewClass(view)) {
		return new view(options);
	}
}

var enumsStore = {};

var enumsApi = {
	getFlag: getFlag,
	hasFlag: hasFlag,
	getByPath: getByPath,
	setByPath: setByPath,
	extendStore: function extendStore(hash) {
		_.extend(enumsStore, hash);
	},
	getEnum: function getEnum(arg) {
		if (_.isObject(arg)) {
			return arg;
		} else if (isEmptyValue(arg) || !_.isString(arg)) {
			return;
		}

		return enumsApi.getByPath(enumsStore, arg);
	}
};

function get$1(arg, flag, options) {
	if (arguments.length === 0) {
		return enumsStore;
	}

	var _enum = enumsApi.getEnum(arg);
	if (arguments.length === 1) {
		return _enum;
	}

	return enumsApi.getFlag(_enum, flag, options);
}

function has(arg, flag, options) {
	var _enum = enumsApi.getEnum(arg);
	return enumsApi.hasFlag(_enum, flag, options);
}

var enums = {
	get: get$1,
	has: has,
	set: function set(name, hash) {
		if (_.isString(name)) {
			enumsApi.setByPath(enumsStore, name, hash);
		} else if (_.isObject(name)) {
			enumsApi.extendStore(name);
		}
	}
};

function skipTake(array, take) {
	var skip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;


	if (!_.isObject(array)) {
		return;
	}

	if (!_.isNumber(take) || !_.isNumber(skip)) {
		throw new Error('skipTake skip and take arguments must be a numbers');
	}

	if (!_.isArray(array)) {
		array = _.toArray(array);
	}

	var length = take + skip;
	if (array.length < length) {
		length = array.length;
	}
	var taken = [];
	for (var x = skip; x < length; x++) {
		taken.push(array[x]);
	}
	return taken;
}

function norm(arg) {
	return _.isObject(arg) ? arg : {};
}

function mergeObjects$$1() {
	for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
		objects[_key] = arguments[_key];
	}

	var flatted = _.reduce(objects, function (dest, item) {
		_.extend(dest, flattenObject(norm(item)));
		return dest;
	}, {});

	return unFlat(flatted);
}

var index$1 = {
	VERSION: version,
	betterResult: betterResult,
	camelCase: camelCase,
	takeFirst: takeFirst,
	comparator: comparator,
	compareAB: compareAB,
	convertString: convertString,
	toNumber: toNumber,
	extend: extend,
	flat: flattenObject,
	getByPath: getByPath,
	getOption: getOption,
	instanceGetOption: instanceGetOption,
	hasFlag: hasFlag, getFlag: getFlag,
	isKnownCtor: isKnownCtor,
	knownCtors: ctors,
	isEmptyValue: isEmptyValue,
	mix: mix,
	paramsToObject: paramsToObject,
	setByPath: setByPath,
	toBool: convertToBoolean,
	unflat: unFlat,
	compareObjects: compareObjects,
	mergeObjects: mergeObjects$$1,
	triggerMethod: triggerMethod,
	triggerMethodOn: triggerMethodOn,
	mergeOptions: mergeOptions,
	buildViewByKey: buildViewByKey,
	enums: enums, enumsStore: enumsStore,
	skipTake: skipTake,
	isClass: isClass, isModel: isModel, isModelClass: isModelClass, isCollection: isCollection, isCollectionClass: isCollectionClass, isView: isView, isViewClass: isViewClass
};

export { version as VERSION, betterResult, camelCase, takeFirst, comparator, compareAB, convertString, toNumber, extend, flattenObject as flat, getByPath, getOption, instanceGetOption, hasFlag, getFlag, isKnownCtor, ctors as knownCtors, isEmptyValue, mix, paramsToObject, setByPath, convertToBoolean as toBool, unFlat as unflat, compareObjects, mergeObjects$$1 as mergeObjects, triggerMethod, triggerMethodOn, mergeOptions, buildViewByKey, enums, enumsStore, skipTake, isClass, isModel, isModelClass, isCollection, isCollectionClass, isView, isViewClass };
export default index$1;

//# sourceMappingURL=index.js.map
