import Mn, { Region } from 'backbone.marionette';
import { Collection, Model, Router, View as View$1 } from 'backbone';

var MnObject = Mn.Object || Mn.MnObject;

function isClass(arg, Base) {
	return _.isFunction(arg) && (arg == Base || arg.prototype instanceof Base);
}

function isModel(arg) {
	return arg instanceof Model;
}

function isModelClass(arg) {
	return isClass(arg, Model);
}

function isCollection(arg) {
	return arg instanceof Collection;
}
function isCollectionClass(arg) {
	return isClass(arg, Collection);
}

function isView(arg) {
	return arg instanceof View$1;
}

function isViewClass(arg) {
	return isClass(arg, View);
}

var extend = Model.extend;

var BaseClass = function BaseClass() {};
BaseClass.extend = extend;

var ctors = _.reduce([Model, Collection, View$1, Router, MnObject, Region, BaseClass], function (ctors, ctor) {
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

function betterResult(obj, key) {
	var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var context = opts.context,
	    args = opts.args,
	    checkAlso = opts.checkAlso,
	    force = opts.force;

	var defaultValue = opts.default;

	if (!_.isString(key) || key === '') return;

	var value = (obj || {})[key];

	if (value != null && (!_.isFunction(value) || isKnownCtor(value))) return value;

	var result = force !== false && _.isFunction(value) ? value.apply(context || obj, args) : value;

	if (result == null && _.isObject(checkAlso)) {
		var alsoOptions = _.omit(opts, 'checkAlso');
		result = betterResult(checkAlso, key, alsoOptions);
	}

	if (result == null && defaultValue != null) result = defaultValue;

	return result;
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
		if (key in (arg || {})) {
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

				if (!_.isArray(single)) return true;
				result = compareAB.apply(undefined, toConsumableArray(single));
				return result === 0;
			});
		}

	return result;
}

function toNumber(text) {
	if (_.isNumber(text)) return text;
	if (!_.isString(text)) return;

	var value = parseFloat(text, 10);
	if (isNaN(value)) value = undefined;

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

//this is under development yet and can be change in any time
function convertString(text, type, opts) {

	switch (type) {
		case 'number':
			return toNumber(text, opts);
		case 'boolean':
			return convertToBoolean(text, opts);
		default:
			return text;
	}
}

function traverse(fields, root) {
	root = root || '';
	if (this == null || _typeof(this) != 'object') {
		return;
	}

	var hash = isModel(this) ? this.attributes : this;

	var props = Object.getOwnPropertyNames(hash);

	for (var x = 0; x < props.length; x++) {
		var name = props[x];
		var prop = this[name];

		if (prop == null || (typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) != 'object' || prop instanceof Date || prop instanceof Array) {

			fields[root + name] = prop;
		} else if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) == 'object') {

			traverse.call(prop, fields, root + name + '.');
		}
	}
}

function flattenObject(obj) {
	if (obj == null || !_.isObject(obj)) return;
	var res = {};
	traverse.call(obj, res);
	return res;
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

function transformStringArray(arr) {
	var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var _opts$ignoreCase = opts.ignoreCase,
	    ignoreCase = _opts$ignoreCase === undefined ? true : _opts$ignoreCase,
	    _opts$toCamelCase = opts.toCamelCase,
	    toCamelCase = _opts$toCamelCase === undefined ? false : _opts$toCamelCase;

	return _(arr).map(function (value) {
		if (ignoreCase) return value.toLowerCase();else if (toCamelCase) return camelCase(value);else return value;
	});
}
function hasFlag(value, flag) {
	var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (value == null || flag == null) return false;

	// if(typeof value != typeof flag)
	// 	throw new Error('value and flag must be of same type. allowed types: string, number');


	if (_.isNumber(value) && _.isNumber(flag)) {
		var has = value & flag;
		return opts.all === true ? has === flag : has > 0;
	} else if (_.isNumber(value) && !_.isNumber(flag) || !_.isNumber(value) && _.isNumber(flag)) {
		return false;
	}

	if (!_.isArray(flag)) {
		flag = flag.toString();
	}
	if (!_.isString(flag) && !_.isArray(flag)) {
		return false;
	}

	var rawflags = _.isArray(flag) ? flag : flag.split(/\s*,\s*/);

	var rawvalues = void 0;
	if (_.isString(value)) {
		rawvalues = value.split(/\s*,\s*/);
	} else if (_.isArray(value)) {
		rawvalues = values;
	} else if (_.isObject(value)) {
		rawvalues = opts.useObjectValues ? _.map(value, function (v) {
			return v;
		}) : _.keys(value);
	} else {
		return false;
	}

	var flags = transformStringArray(rawflags, opts);
	var values = transformStringArray(rawvalues, opts);

	var intersection = _.intersection(values, flags);
	if (intersection.length == 0) return false;
	if (intersection.length == flags.length) return true;
	return opts.all != true;

	// if(_.isString(value) && _.isString(flag)) {
	// 	if(value === '' || flag === '') return false;
	// 	let values = transformStringArray(value.split(/\s*,\s*/), opts);
	// 	let flags = transformStringArray(flag.split(/\s*,\s*/), opts);

	// }
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
		if (item == null) return;
		result.push(item.toString());
		return result;
	}, []);
}

function compare(a, b) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (a == null) {
		return false;
	}
	var _options$caseInsensit = options.caseInsensitive,
	    caseInsensitive = _options$caseInsensit === undefined ? true : _options$caseInsensit;

	if (!_.isString(a)) {
		a = a.toString();
	}
	if (caseInsensitive) {
		a = a.toLowerCase();
		b = b.toLowerCase();
	}
	return a === b;
}

function getFlag(value, flag) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var flags = void 0;
	if (isEmptyValue(value) || isEmptyValue(flag)) {
		return;
	}
	var returnAs = options.returnAs,
	    useObjectValues = options.useObjectValues,
	    takeObjectKeys = options.takeObjectKeys,
	    all = options.all,
	    _options$delimeter = options.delimeter,
	    delimeter = _options$delimeter === undefined ? ', ' : _options$delimeter,
	    doNotPluck = options.doNotPluck;

	if (_.isString(flag)) {
		flags = normalizeStringArray(flag.split(/\s*,\s*/gmi), options);
	} else if (_.isArray(flag)) {
		flags = normalizeStringArray(flag, options);
	} else {
		return;
	}
	if (returnAs == null) {
		returnAs = _.isArray(flag) ? 'array' : 'string';
	}
	if (_.isString(value)) {
		value = normalizeStringArray(value.split(/\s*,\s*/gmi), options);
	}
	var isArray = _.isArray(value);
	var method = all ? 'every' : 'some';
	var founded = _.reduce(value, function (filtered, item, key) {
		var check = item;
		if (!isArray && !useObjectValues) {
			check = key;
		}

		var good = _[method](flags, function (flag) {
			return compare(check, flag, options);
		});
		//console.log(method, good, flags, value);
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

	//console.log(founded);
	if (returnAs === 'string') {
		if (isArray) {
			return founded.join(delimeter);
		} else {
			var key = takeObjectKeys ? 'key' : 'value';
			return _.pluck(founded, key).join(delimeter);
		}
	} else if (returnAs === 'array') {
		if (isArray || doNotPluck) {
			return founded;
		} else {
			var _key = takeObjectKeys ? 'key' : 'value';
			return _.pluck(founded, _key);
		}
	} else if (returnAs === 'object') {
		return _.reduce(founded, function (result, item, index) {
			var value = isArray ? item : takeObjectKeys ? item.key : item.value;
			var key = isArray ? index : takeObjectKeys ? item.value : item.key;
			result[key] = value;
			return result;
		}, {});
	}
}

var defaultOptions$1 = {
	mergeObjects: true,
	wrapObjectWithConstructor: true
};

function createMixinFromObject(arg) {
	var mixedObj = _.clone(arg);
	var mixedCtor = _.isFunction(mixedObj.constructor) && mixedObj.constructor;
	return function (Base) {
		if (_.isFunction(mixedCtor)) {
			//let providedCtor = ((mixed) => mixed)(obj.constructor);
			mixedObj.constructor = function mx() {
				Base.apply(this, arguments);
				mixedCtor.apply(this, arguments);
			};
		}
		return Base.extend(mixedObj);
	};
}

function normalizeArguments(args) {
	var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
	if (!mixins.length) return Mixed;else return _.reduce(mixins, function (Memo, Ctor) {
		var mixed = Ctor(Memo);
		return mixed;
	}, Mixed);
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

	if (!_.isFunction(ctor.extend)) ctor.extend = extend;

	return {
		options: opts,
		with: withMethod,
		class: ctor
	};
}

function pstoSetPair(context, pair) {
	if (!_.isString(pair)) return;
	var keyvalue = pair.split('=');
	var key = keyvalue.shift();
	var value = keyvalue.join('=');
	pstoSetKeyValue(context, key, value);
}

function pstoSetKeyValue(context, key, value) {

	if (key == null) return;
	key = decodeURIComponent(key);
	value != null && (value = decodeURIComponent(value));

	if (!(key in context)) return context[key] = value;

	!_.isArray(context[key]) && (context[key] = [context[key]]);

	context[key].push(value);

	return context[key];
}

function paramsToObject(raw) {
	var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { emptyObject: true };

	var result = {};
	if (!_.isString(raw)) return opts.emptyObject ? result : raw;

	var pairs = raw.split('&');
	_(pairs).each(function (pair) {
		return pstoSetPair(result, pair);
	});

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

function ensureSetByPathArguments(context, path) {
	var errors = [];
	if (context == null || !_.isObject(context)) {
		errors.push(new Error('Context is not an object'));
	}
	if (!_.isString(path) || path === '') {
		errors.push(new Error('Path is not a string'));
	}
	if (errors.length) {
		return errors;
	}
}

function setByPathArr(context, propertyName, pathArray, value, options) {

	var argumentsErrors = ensureSetByPathArguments(context, propertyName);
	if (argumentsErrors) {
		return;
	}

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

		return setProperty(context, propertyName, value, options);
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


	var options = _.extend({}, opts, ext, {
		silent: opts.silent === true,
		force: opts.force !== false,
		//passPath: [],
		models: []
	});

	return options;
}

function triggerModelEventsOnSetByPath(value) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

function setByPath(context, path, value) {
	var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


	var argumentsErrors = ensureSetByPathArguments(context, path);
	if (argumentsErrors) {
		return value;
	}

	var pathArray = path.split('.');
	var options = normalizeSetByPathOptions(opts, { path: path, pathArray: [].slice.call(pathArray) });

	var propertyName = pathArray.shift();

	var result = setByPathArr(context, propertyName, pathArray, value, options);

	if (result === undefined && value !== undefined) {
		return value;
	}

	triggerModelEventsOnSetByPath(value, options);

	return value;

	// if (_.isObject(path) && !_.isArray(path)) {
	// 	value = path.value;
	// 	options.force = path.force !== false;
	// 	options.silent = path.silent === true;
	// 	path = path.path;
	// }

	// var prop = pathArray.shift();

	// if (isModel(context)) {
	// 	options.models.push({
	// 		path: '',
	// 		property: prop,
	// 		model: context
	// 	});
	// }
}

function unFlat(obj) {

	if (obj == null || !_.isObject(obj)) return;
	var res = {};
	for (var e in obj) {
		setByPath(res, e, obj[e]);
	}
	return res;
}

function compareObjects(objectA, objectB) {

	if (!_.isObject(objectA) || !_.isObject(objectB)) {
		return objectA == objectB;
	}
	if (_.isArray(objectA) && !_.isArray(objectB) || _.isArray(objectB) && !_.isArray(objectA)) {
		return false;
	}

	if ((typeof objectA === "undefined" ? "undefined" : _typeof(objectA)) != (typeof objectB === "undefined" ? "undefined" : _typeof(objectB))) return false;

	var size = _.size(objectA);
	if (size != _.size(objectB)) return false;

	if (_.isArray(objectA)) {
		var allvalues = _.uniq(objectA.concat(objectB));
		return _.every(allvalues, function (value) {
			var valuesA = _.filter(objectA, function (_v) {
				return _v == value;
			});
			var valuesB = _.filter(objectB, function (_v) {
				return _v == value;
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

function triggerMethod(event) {
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
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

function triggerMethodOn(context, event) {
	for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		args[_key - 2] = arguments[_key];
	}

	return triggerMethod.call.apply(triggerMethod, [context, event].concat(args));
}

function mergeOptions(options, keys) {
	var _this = this;

	if (!options) {
		return;
	}

	_.each(keys, function (key) {
		var option = options[key];
		if (option !== undefined) {
			_this[key] = option;
		}
	});
}

function buildViewByKey(key) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    TextView = _ref.TextView,
	    options = _ref.options;

	if (!_.isString(key)) {
		return;
	}

	var view = getOption(this, key, { args: [this] });
	var _options = getOption(this, key + 'Options', { args: [this] });

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

function getEnum(arg) {
	if (isEmptyValue(arg)) {
		return {};
	} else if (_.isString(arg)) {
		return getByPath(enumsStore, arg) || {};
	} else if (_.isObject(arg)) {
		return arg;
	}
}

function get$1(arg, flag, options) {
	var _enum = getEnum(arg);
	return getFlag(_enum, flag, options);
}

function has(arg, flag, options) {
	var _enum = getEnum(arg);
	return hasFlag(_enum, flag, options);
}

var index = {
	get: get$1,
	has: has,
	set: function set(name, hash) {
		if (_.isString(name)) {
			setByPath(enumsStore, name, hash);
		} else if (_.isObject(name)) {
			_.extend(enumsStore, name);
		}
	}
};

function skipTake(array, take) {
	var skip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	if (array == null) {
		return;
	}
	if (!_.isNumber(take) || _.isNumber(skip)) {
		throw new Error('skipTake skip and take arguments must be a number');
	}
	if (!_.isArray(array) && _.isObject(array)) {
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

function mergeObject(src, dst) {
	if (!_.isObject(src) || !_.isObject(dst)) {
		return dst;
	}
	var flatSrc = flattenObject(src);
	var flatDst = flattenObject(dst);
	_.each(flatDst, function (value, key) {
		flatSrc[key] = value;
	});
	return unFlat(flatSrc);
}

export { betterResult, camelCase, takeFirst, comparator, compareAB, convertString, extend, flattenObject as flat, getByPath, getOption, hasFlag, getFlag, isKnownCtor, ctors as knownCtors, mix, paramsToObject, setByPath, convertToBoolean as toBool, unFlat as unflat, compareObjects, mergeObject as mergeObjects, triggerMethod, triggerMethodOn, mergeOptions, buildViewByKey, index as enums, skipTake, isClass, isModel, isModelClass, isCollection, isCollectionClass, isView, isViewClass };

//# sourceMappingURL=index.js.map
