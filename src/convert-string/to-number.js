import _ from 'underscore';
export default function toNumber(text){

	if(_.isNumber(text) && !_.isNaN(text)) {
		return text;
	} else if (text == null || !_.isString(text)) { 
		return; 
	}
	
	let value = parseFloat(text, 10);

	if(isNaN(value)) { return; }
		
	return value;
}
