import _ from 'underscore';
export default function skipTake(array, take, skip = 0){
	
	if(!_.isObject(array)) { return; }	

	if (!_.isNumber(take) || !_.isNumber(skip)) {
		throw new Error('skipTake skip and take arguments must be a numbers');
	}

	if (!_.isArray(array)) {
		array = _.toArray(array);
	}

	let length = take + skip;
	if(array.length < length) { length = array.length; }
	let taken = [];
	for (let x = skip; x < length; x++) {
		taken.push(array[x]);
	}
	return taken;
}
