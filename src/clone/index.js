import _ from 'underscore';

function cloneObject(obj, options) {
	if(!options.refs) {
		options.refs = [obj];
	} else {
		if (options.refs.indexOf(obj) > -1) {
			return;
		} else {
			options.refs.push(obj);
		}
	}
	return _.reduce(obj, (memo, value, key) => {
		let cloned = cloneValue(value, options);
		if (cloned !== undefined || obj[key] === undefined) {
			memo[key] = cloned;
		}
		return memo;
	}, {});
}

export default function cloneValue(value, options = {}){
	let { functions, deep = true } = options;
	if (!deep) {
		return _.clone(value);
	}

	if (_.isFunction(value)) {
		return functions ? value : undefined;
	} else if (_.isDate(value)) {
		return new Date(value.valueOf());
	} else if(_.isArray(value)) {
		return _.clone(value);
	}
	else if(_.isObject(value)) {
		return cloneObject(value, options);
	} else {
		return _.clone(value);
	}
}
