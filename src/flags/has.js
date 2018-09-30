import { searchFlags, normalizeValueAndFlag } from './helpers';


export default function hasFlag(value, flag, options = {}){

	if (value == null || flag == null) return false;

	if(_.isNumber(value)) {

		if (!_.isNumber(flag)) return false;

		let has = value & flag;
		return options.all === true ? has === flag : has > 0;

	}
	
	let { flags, values } = normalizeValueAndFlag(value, flag, options);
	if (!flags || !values) {
		return false;
	}


	let founded = searchFlags(values, flags, options);
	return !!founded && !!founded.length;

}
