import _ from 'underscore';
import { searchFlags, normalizeValueAndFlag } from './helpers';


const processReturns = {
	string: ({ isArray, founded, delimeter, takeObjectKeys }) => {		
		if (isArray) {
			return founded.join(delimeter);
		} else {
			let key = takeObjectKeys ? 'key' : 'value';
			return _.pluck(founded, key).join(delimeter);
		}		
	},
	array: ({ isArray, doNotPluck, founded, takeObjectKeys }) => {
		if (isArray || doNotPluck) {
			return founded;
		} else {
			let key = takeObjectKeys ? 'key' : 'value';
			return _.pluck(founded, key);
		}		
	},
	object: ({ isArray, takeObjectKeys, founded }) => {
		return _.reduce(founded, (result, item, index) => {
			let value = isArray 
				? item 
				: takeObjectKeys ? item.key : item.value;
			let key = isArray 
				? index 
				: takeObjectKeys ? item.value : item.key;
			result[key] = value;
			return result;
		}, {});
	},
};

function normalizedReturn({ returnAs, flag, isArray, founded, delimeter, takeObjectKeys, doNotPluck }){	
	if (returnAs == null) {
		returnAs = _.isArray(flag) ? 'array' : 'string';
	}	
	let processor = processReturns[returnAs];	
	if(!_.isFunction(processor)) { return; }

	let processorOptions = {
		isArray, founded, delimeter, takeObjectKeys, doNotPluck
	};

	return processor(processorOptions);
}






export default function getFlag(value, flag, options = {}) {

	let { flags, values } = normalizeValueAndFlag(value, flag, options);
	if (!flags || !values) {
		return;
	}


	let founded = searchFlags(values, flags, options);
	if(!founded) {
		return;
	}

	let returnOptions = _.extend({ 
		delimeter: ', ', 
		isArray: _.isArray(values),
		flag,
		founded
	}, _.pick(options, 'returnAs', 'takeObjectKeys', 'doNotPluck' ));
	
	
	return normalizedReturn(returnOptions);
}
