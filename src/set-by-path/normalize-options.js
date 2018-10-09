import _ from 'underscore';
export default function normalizeSetByPathOptions(opts = {}, ext)
{
	let { silent, force } = opts;
	silent = silent === true;
	force = force !== false;
	let options = _.extend({}, opts, ext, {
		silent, force,
		models: []
	});

	return options;
}
