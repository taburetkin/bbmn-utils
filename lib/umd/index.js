(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('underscore'), require('bbmn-core'), require('backbone.marionette')) :
	typeof define === 'function' && define.amd ? define(['exports', 'underscore', 'bbmn-core', 'backbone.marionette'], factory) :
	(factory((global.bbmn = global.bbmn || {}, global.bbmn.utils = {}),global._,global.bbmn,global.Mn));
}(this, (function (exports,_,bbmnCore,Mn) { 'use strict';

_ = _ && _.hasOwnProperty('default') ? _['default'] : _;
Mn = Mn && Mn.hasOwnProperty('default') ? Mn['default'] : Mn;

var version = "1.0.20";

var ctors = _.reduce([bbmnCore.Model, bbmnCore.Collection, bbmnCore.BackboneView, bbmnCore.Router, bbmnCore.MnObject, bbmnCore.Region, bbmnCore.BaseClass], function (ctors, ctor) {
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
	if (!_.isFunction(arg)) {
		return false;
	}
	return _(ctors).some(function (ctor) {
		return arg === ctor || arg.prototype instanceof ctor;
	});
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

	if (bbmnCore.isModel(arg)) {
		return arg;
	}

	if (bbmnCore.isView(arg)) {
		return arg.model;
	}
}

function getModel$1(arg) {
	return bbmnCore.isView(arg) && arg;
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
function convertString(text, type, options) {

	if (!_.isString(type)) {
		return text;
	}

	var converter = converters[type];

	if (!_.isFunction(converter)) {
		return text;
	}

	return converter(text, options);
}

function isBadSource(src, flatted) {
	if (typeof global !== 'undefined' && src === global) {
		return true;
	} else if (typeof window !== 'undefined' && src === window) {
		return true;
	} else if (flatted.indexOf(src) > -1) {
		return true;
	}
}

var privateApi = {
	traverse: function traverse(source) {
		var destination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
		var sources = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

		if (_.isFunction(source) || _.isArray(source)) {
			return source;
		}
		if (isBadSource(source, sources)) {
			return;
		}
		sources.push(source);
		var hash = bbmnCore.isModel(source) ? source.attributes : source;

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
			} else if (!_.isObject(prop) || _.isFunction(prop)) {
				destination[root + name] = prop;
			} else {
				privateApi.traverse(prop, destination, root + name + '.', _.clone(sources));
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

function isEmptyValue(arg) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$allowWhiteSpace = _ref.allowWhiteSpace,
	    allowWhiteSpace = _ref$allowWhiteSpace === undefined ? false : _ref$allowWhiteSpace;

	if (arg == null || _.isNaN(arg)) return true;

	if (!_.isString(arg)) return false;

	if (arg === '') return true;

	return !allowWhiteSpace && arg.trim() === '';
}

function getProperty(context, name) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (!_.isObject(context) || isEmptyValue(name)) {
		return;
	}

	if (bbmnCore.isModel(context)) {
		var noModelAttributes = options.noModelAttributes,
		    includeModelProperty = options.includeModelProperty,
		    modelPropertyFirst = options.modelPropertyFirst;


		var attrValue = context.get(name, { gettingByPath: true });
		var propValue = context[name];
		var value = void 0;

		if (noModelAttributes === true) {
			value = propValue;
		} else if (modelPropertyFirst) {
			value = propValue != null ? propValue : attrValue;
		} else if (includeModelProperty) {
			value = attrValue != null ? attrValue : propValue;
		} else {
			value = attrValue;
		}

		return value;
	} else {
		return context[name];
	}
}

function getByPathArray(context, propertyName, pathArray, options) {

	if (!_.isObject(context) || isEmptyValue(propertyName)) return;

	var prop = getProperty(context, propertyName, options);

	if (!pathArray.length || prop == null) return prop;

	var nextName = pathArray.shift();

	return getByPathArray(prop, nextName, pathArray, options);
}

function getByPath(obj, path, options) {

	if (!_.isObject(obj) || isEmptyValue(path)) return;

	var pathArray = _.isString(path) ? path.split('.') : _.isArray(path) ? [].slice.call(path) : [path];

	var prop = pathArray.shift();

	return getByPathArray(obj, prop, pathArray, options);
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

function normalizeStringArray(arr) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    caseSensitive = _ref.caseSensitive;

	var check = {};
	return _.reduce(arr, function (result, item) {

		if (isEmptyValue(item)) {
			return result;
		}
		item = item.toString();
		var checkKey = caseSensitive ? item : item.toLowerCase();
		if (checkKey in check) {
			return result;
		}
		check[checkKey] = 1;
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

function compare(a, b, _ref2) {
	var caseSensitive = _ref2.caseSensitive;


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
	if (!result.length || all && result.length != flags.length) {
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
		ctor.extend = bbmnCore.extend;
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
	return pstoSetKeyValue(context, key, value, options);
}

function pstoSetKeyValue(context, key, value, options) {

	if (isEmptyValue(key)) return;

	key = decodeURIComponent(key);
	value = decodeURIComponent(value);

	var transform = options.transform;
	if (_.isFunction(transform)) {
		value = transform(key, value, options);
	}

	if (isEmptyValue(value)) return;

	if (key in context) {
		if (!_.isArray(context[key])) {
			context[key] = [context[key]];
		}
		context[key].push(value);
	} else {
		context[key] = value;
	}
	return { key: key, value: value };
}

function paramsToObject(raw, options) {
	var emptyObject = options.emptyObject !== false;
	var result = {};
	if (!_.isString(raw)) return emptyObject ? result : undefined;

	var rawpairs = raw.split('&');
	var pairs = _(rawpairs).reduce(function (memo, rawpair) {
		var pair = pstoSetPair(result, rawpair, options);
		if (pair != null) {
			memo.push(pair);
		}
		return memo;
	}, []);

	if (!_.size(result) && !emptyObject) {
		return;
	}

	return !options.asArray ? result : pairs;
}

function setProperty(context, name, value) {
	if (bbmnCore.isModel(context)) {
		context.set(name, value, { silent: true });
	} else {
		context[name] = value;
	}

	return getProperty(context, name);
}

function setByPathArr(context, propertyName, pathArray, value, options) {

	var modelContext = void 0;
	if (bbmnCore.isModel(context)) {
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

function parseKey(raw) {
	var chunks = raw.split('.');
	var _key = chunks.shift();
	var rest = chunks.join('.');
	chunks = _key.split('[');
	var key = chunks.shift();
	var index = chunks.length ? parseInt(chunks.shift().replace(/\D/g, ''), 10) : false;
	return {
		raw: raw,
		key: key,
		rest: rest,
		property: rest.split('.').shift() || undefined,
		index: index,
		notIndexed: index === false
	};
}

function buildKeyPath(k) {
	var path = [];
	k.key && path.push(k.key);
	path.push(k.index);
	k.property && path.push(k.property);
	if (path.length != 3) return;
	return path.join('.');
}

function build(text, opts) {

	var params = paramsToObject(text, _.extend({}, opts, { asArray: true }));

	var qs = {};
	var allmeeted = {};

	function hasMeet(k) {
		var path = buildKeyPath(k);
		return path && allmeeted[path] == true;
	}
	function markAsMeeted(k) {
		var path = buildKeyPath(k);
		path && (allmeeted[path] = true);
	}

	_.each(params, function (_ref) {
		var value = _ref.value,
		    key = _ref.key;


		var okey = parseKey(key);

		var stored = qs[okey.key];

		if (!stored) {
			if (!_.isNumber(okey.index)) {
				okey.index = 0;
			}
			if (okey.property) {
				var hash = {};
				setByPath(hash, okey.rest, value);
				value = hash;
				markAsMeeted(okey);
			}
			if (okey.index) {
				var arr = [];
				arr[okey.index] = value;
				value = arr;
			}
			qs[okey.key] = value;
		} else {
			if (!_.isArray(stored)) {
				if (!_.isNumber(okey.index)) {
					okey.index = 0;
				}
				var meeted = hasMeet(okey);
				if (okey.property) {
					if (!meeted) {
						var _hash = !okey.index && _.isObject(stored) ? stored : {};
						setByPath(_hash, okey.rest, value);
						markAsMeeted(okey);
						if (okey.index) {
							stored = [stored];
							stored[okey.index] = _hash;
						}
					} else {
						stored = [stored];
						okey.index = stored.length;
						var _hash2 = {};
						setByPath(_hash2, okey.rest, value);
						markAsMeeted(okey);
						stored.push(_hash2);
					}
				} else {
					stored = [stored];
					var index = okey.index || stored.length;
					stored[index] = value;
				}
			} else {
				if (okey.property) {
					if (!_.isNumber(okey.index)) {
						okey.index = stored.length - 1;
					}
					var _meeted = hasMeet(okey);
					if (!_meeted) {
						var exists = stored[okey.index];
						var _hash3 = exists || {};
						setByPath(_hash3, okey.rest, value);
						if (!exists) {
							stored[okey.index] = _hash3;
						}
						markAsMeeted(okey);
					} else {
						var _exists = !okey.notIndexed && stored[okey.index];
						var _hash4 = _exists || {};
						setByPath(_hash4, okey.rest, value);
						if (okey.notIndexed) okey.index = stored.length;
						markAsMeeted(okey);
						if (!_exists) stored[okey.index] = _hash4;
					}
				} else {
					var _index = okey.index || stored.length;
					stored[_index] = value;
				}
			}
			qs[okey.key] = stored;
		}
	});
	return qs;
}

function paramsToObject$1(raw) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	if (options.complex) {
		return build(raw, _.omit(options, 'complex'));
	} else {
		return paramsToObject(raw, options);
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

/*
function check(arg, opts) {
	opts.ob += _.isObject(arg) && 1 || 0;
	opts.ar += _.isArray(arg) && 1 || 0;
	opts.fn += _.isFunction(arg) && 1 || 0;
	opts.sum += (opts.ob + opts.ar + opts.fn);
}

function checkArguments(a,b)
{
	let chck = { ob:0, ar:0, fn: 0, sum:0  };
	check(a, chck);
	check(b, chck);
	return [chck.sum, chck.ob, chck.fn, chck.ar];
}

*/

function getType(arg) {
	if (_.isFunction(arg)) {
		return 8;
	} else if (_.isArray(arg)) {
		return 4;
	} else if (_.isObject(arg)) {
		return 2;
	} else {
		return 1;
	}
}
function sameType(a, b) {
	var at = getType(a);
	var bt = getType(b);
	return at == bt && at != 8 ? at : false;
}
function compareObjects(objectA, objectB) {

	if (objectA == null && objectB == null) {
		return objectA == objectB;
	}

	if (objectA === '' || objectB === '') {
		return objectA === objectB;
	}

	if (objectA == objectB) {
		return true;
	}

	var type = sameType(objectA, objectB);
	if (!type) {
		return false;
	} else if (type == 1) {
		return objectA == objectB;
	}

	objectA = flattenObject(objectA);
	objectB = flattenObject(objectB);

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

function isCtor(instance, ctor, checkCtor) {
	return _.isFunction(ctor) && bbmnCore.isClass(instance, ctor) || _.isFunction(checkCtor) && checkCtor(instance) || isKnownCtor(instance);
}

function shouldInvoke(instance, ctor, checkCtor) {
	return _.isFunction(instance) && !isCtor(instance, ctor, checkCtor);
}

function getByKey(context, key) {
	var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	    ctor = _ref.ctor,
	    checkCtor = _ref.checkCtor,
	    options = _ref.options,
	    defaultOptions = _ref.defaultOptions,
	    invokeContext = _ref.invokeContext,
	    invokeArguments = _ref.invokeArguments;

	if (!_.isString(key)) {
		return;
	}

	var instance = getOption(context, key, { force: false, args: [context] });
	if (instance == null) {
		return;
	}
	!invokeContext && (invokeContext = context);
	!invokeArguments && (invokeArguments = [context]);
	if (shouldInvoke(instance, ctor, checkCtor)) {
		instance = instance.apply(invokeContext, invokeArguments);
	}

	var contextOptions = getOption(context, key + 'Options', { force: false, args: [context] });
	if (_.isFunction(contextOptions)) {
		contextOptions = contextOptions.apply(invokeContext, invokeArguments);
	}
	var compiledOptions = _.extend({}, defaultOptions, contextOptions, options);

	if (_.isFunction(instance)) {

		return {
			definition: instance,
			options: compiledOptions
		};
	}

	return { value: instance, options: compiledOptions };
}

function buildByKey(context, key) {
	var getOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var buildContext = getByKey(context, key, getOptions);

	if (!_.isObject(buildContext)) {
		return;
	}

	var buildText = getOptions.buildText,
	    ctor = getOptions.ctor,
	    checkCtor = getOptions.checkCtor,
	    knownCtor = getOptions.knownCtor,
	    toArguments = getOptions.toArguments;
	var value = buildContext.value,
	    definition = buildContext.definition,
	    options = buildContext.options;


	if (!_.isFunction(toArguments)) toArguments = function toArguments(context, definition, options) {
		return [options];
	};

	var args = toArguments.call(context, context, definition, options);

	if (value != null) {
		if (!_.isObject(value)) {
			if (_.isFunction(buildText)) {
				return buildText.apply(undefined, [value].concat(toConsumableArray(args)));
			}
		} else {
			if (isCtor(value.constructor, ctor, checkCtor, knownCtor)) {
				return value;
			}
		}
	} else {
		return new (Function.prototype.bind.apply(definition, [null].concat(toConsumableArray(args))))();
	}
}

function buildViewByKey(context, key) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	//{ TextView, defaultOptions, options } = {}){
	/*
 let getOptions = {
 	defaultOptions,
 	options,
 	checkCtor: (ctor) => isViewClass(ctor)
 };
 
 if (TextView != null && isViewClass(TextView)) {
 	getOptions.buildText = (text, opts) => new TextView(_.extend({}, opts, { text }));
 }
 */
	var TextView = options.TextView;


	var checkCtor = function checkCtor(ctor) {
		return bbmnCore.isViewClass(ctor);
	};

	var buildText = TextView != null && bbmnCore.isViewClass(TextView) ? function (text, opts) {
		return new TextView(_.extend({}, opts, { text: text }));
	} : undefined;

	var getOptions = _.extend({ checkCtor: checkCtor, buildText: buildText }, options);

	return buildByKey(context, key, getOptions);
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

var config = {
	destroySelfOnEmpty: false,
	destroyOnEmpty: false,
	replaceElement: false
};

var BaseNodeRegion = bbmnCore.Region.extend({
	onEmpty: function onEmpty() {
		var destroySelf = this.getOption('destroySelfOnEmpty') || this.getOption('destroyOnEmpty');
		var destroyNode = this.getOption('destroyOnEmpty');
		if (destroySelf) {
			this.destroy();
		}
		if (destroyNode) {
			this.el.remove();
		}
	}
});

config.Region = BaseNodeRegion;

function normalizeElement(selector) {
	var body = document.querySelector('body');
	var el = void 0;
	if (selector == null) {
		el = body;
	} else if (selector instanceof Element) {
		el = selector;
	} else if (selector && selector.jquery) {
		el = selector.get(0);
	} else if (_.isString(selector)) {
		el = document.querySelector(selector);
	}
	if (el instanceof Element) {
		return el;
	} else {
		throw new Error('el must be in Dom');
	}
}

var renderInNode = function renderInNode(view, opts) {
	var options = _.extend({}, config, opts);
	var el = options.el,
	    replaceElement = options.replaceElement,
	    destroySelfOnEmpty = options.destroySelfOnEmpty,
	    destroyOnEmpty = options.destroyOnEmpty,
	    defer = options.defer;


	var NodeRegion = config.Region;
	el = normalizeElement(el);
	var body = document.querySelector('body');
	if (el === body) {
		el = document.createElement('div');
		body.appendChild(el);
		replaceElement = true;
	}
	var region = new NodeRegion({ el: el, replaceElement: replaceElement, destroySelfOnEmpty: destroySelfOnEmpty, destroyOnEmpty: destroyOnEmpty });
	if (defer) {
		_.defer(function () {
			return region.show(view);
		});
	} else {
		region.show(view);
	}
	return region;
};

renderInNode.config = config;

function cloneObject(obj, options) {
	if (!options.refs) {
		options.refs = [obj];
	} else {
		if (options.refs.indexOf(obj) > -1) {
			return;
		} else {
			options.refs.push(obj);
		}
	}
	return _.reduce(obj, function (memo, value, key) {
		var cloned = cloneValue(value, options);
		if (cloned !== undefined || obj[key] === undefined) {
			memo[key] = cloned;
		}
		return memo;
	}, {});
}

function cloneValue(value) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var functions = options.functions,
	    _options$deep = options.deep,
	    deep = _options$deep === undefined ? true : _options$deep;

	if (!deep) {
		return _.clone(value);
	}

	if (_.isFunction(value)) {
		return functions ? value : undefined;
	} else if (_.isDate(value)) {
		return new Date(value.valueOf());
	} else if (_.isArray(value)) {
		return _.clone(value);
	} else if (_.isObject(value)) {
		return cloneObject(value, options);
	} else {
		return _.clone(value);
	}
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
	extend: bbmnCore.extend,
	flat: flattenObject,
	getByPath: getByPath,
	getOption: getOption,
	instanceGetOption: instanceGetOption,
	hasFlag: hasFlag, getFlag: getFlag,
	isKnownCtor: isKnownCtor,
	knownCtors: ctors,
	isEmptyValue: isEmptyValue,
	mix: mix,
	paramsToObject: paramsToObject$1,
	setByPath: setByPath,
	toBool: convertToBoolean,
	unflat: unFlat,
	compareObjects: compareObjects,
	mergeObjects: mergeObjects$$1,
	clone: cloneValue,
	triggerMethod: triggerMethod,
	triggerMethodOn: triggerMethodOn,
	mergeOptions: mergeOptions,
	buildByKey: buildByKey,
	buildViewByKey: buildViewByKey,
	enums: enums, enumsStore: enumsStore,
	skipTake: skipTake,
	renderInNode: renderInNode,
	isClass: bbmnCore.isClass, isModel: bbmnCore.isModel, isModelClass: bbmnCore.isModelClass, isCollection: bbmnCore.isCollection, isCollectionClass: bbmnCore.isCollectionClass, isView: bbmnCore.isView, isViewClass: bbmnCore.isViewClass
};

exports.VERSION = version;
exports.betterResult = betterResult;
exports.camelCase = camelCase;
exports.takeFirst = takeFirst;
exports.comparator = comparator;
exports.compareAB = compareAB;
exports.convertString = convertString;
exports.toNumber = toNumber;
exports.extend = bbmnCore.extend;
exports.flat = flattenObject;
exports.getByPath = getByPath;
exports.getOption = getOption;
exports.instanceGetOption = instanceGetOption;
exports.hasFlag = hasFlag;
exports.getFlag = getFlag;
exports.isKnownCtor = isKnownCtor;
exports.knownCtors = ctors;
exports.isEmptyValue = isEmptyValue;
exports.mix = mix;
exports.paramsToObject = paramsToObject$1;
exports.setByPath = setByPath;
exports.toBool = convertToBoolean;
exports.unflat = unFlat;
exports.compareObjects = compareObjects;
exports.mergeObjects = mergeObjects$$1;
exports.clone = cloneValue;
exports.triggerMethod = triggerMethod;
exports.triggerMethodOn = triggerMethodOn;
exports.mergeOptions = mergeOptions;
exports.buildByKey = buildByKey;
exports.buildViewByKey = buildViewByKey;
exports.enums = enums;
exports.enumsStore = enumsStore;
exports.skipTake = skipTake;
exports.renderInNode = renderInNode;
exports.isClass = bbmnCore.isClass;
exports.isModel = bbmnCore.isModel;
exports.isModelClass = bbmnCore.isModelClass;
exports.isCollection = bbmnCore.isCollection;
exports.isCollectionClass = bbmnCore.isCollectionClass;
exports.isView = bbmnCore.isView;
exports.isViewClass = bbmnCore.isViewClass;
exports['default'] = index$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=index.js.map
