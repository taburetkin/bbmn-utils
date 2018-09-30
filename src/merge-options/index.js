export default function mergeOptions(options, ...keys) {
	if (!_.isObject(options)) { return; }
  
	keys = _.flatten(keys);

	return _.reduce(keys, (merged, key) => {
		if(!_.isString(key)) {
			return merged;
		}
		const option = options[key];

		if (option !== undefined) {
			this[key] = option;
			merged[key] = option;
		}
		
		return merged;
	}, {});
}
