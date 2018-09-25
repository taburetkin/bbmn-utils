import { isView }  from 'bbmn-core';
export default function getModel(arg){
	return isView(arg) && arg;
}
