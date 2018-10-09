import _ from 'underscore';

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

export default function compareObjects(objectA, objectB) {
	let [sum, ...vals] = checkArguments(objectA, objectB);
	if (sum === 0) {
		return objectA == objectB;
	}
	if(!_.every(vals, val => val % 2 === 0)) {
		return false;
	}

	let size = _.size(objectA);
	if (size != _.size(objectB)) { return false; }

	if (_.isArray(objectA)) {
		let allvalues = _.uniq(objectA.concat(objectB));
		return _.every(allvalues, value => {
			let valuesA = _.filter(objectA, _v => compareObjects(_v,value));
			let valuesB = _.filter(objectB, _v => compareObjects(_v,value));
			if (valuesA.length != valuesB.length) return false;
			return compareObjects(valuesA[0], valuesB[0]);
		});
	} else {
		let allkeys = _.uniq(_.keys(objectA).concat(_.keys(objectB)));
		if (allkeys.length != size) return false;
		return _.every(allkeys, key => {
			return compareObjects(objectA[key], objectB[key]);
		});
	}
}
