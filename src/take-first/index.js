export default function takeFirst(key, ...args) {
	if(!_.isString(key) || key === '') return;
	let value;
	_.some(args, arg => {
		if (!_.isObject(arg)) { return false; }

		if (key in arg) {
			value = arg[key];
			return true;
		}
	});
	return value;
}
