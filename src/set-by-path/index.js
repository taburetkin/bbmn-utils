import setByPathArray from './set-by-path-array.js';
import normalizeOptions from './normalize-options.js';
import triggerModelChangeEvents from './trigger-model-change-events.js';
import ensureArguments from './ensure-arguments.js';
export default function setByPath(context, path, value, opts) {

	let argumentsErrors = ensureArguments(context, path);
	if (argumentsErrors) {
		return value;
	}

	let pathArray = path.split('.');	
	let options = normalizeOptions(opts, { path, pathArray: [].slice.call(pathArray) });

	let propertyName = pathArray.shift();

	let result = setByPathArray(context, propertyName, pathArray, value, options);
	if (result === undefined) {
		return value;
	} else {
		triggerModelChangeEvents(value, options);
		return result.value;
	}

}


