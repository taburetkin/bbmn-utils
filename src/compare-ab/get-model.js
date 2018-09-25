import { isModel, isView } from 'bbmn-core';

export default function getModel(arg){

	if (isModel(arg)) { return arg; }
	
	if (isView(arg)) { return arg.model; }

}
