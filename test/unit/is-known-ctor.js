import '../setup';
// import isKnownCtor from '../../../src/utils/is-known-ctor';
// import ctors from '../../../src/utils/is-known-ctor/ctors';
// import { Model } from '../../../src/vendors/backbone.js';

import { isKnownCtor, knownCtors } from '../../src/index.js';
import { Model } from 'bbmn-core';

describe('isKnownCtor: ',function(){
	it('should return false if argument is not a function', function(){
		expect(isKnownCtor()).to.be.false;
		expect(isKnownCtor(null)).to.be.false;
		expect(isKnownCtor('foo')).to.be.false;
		expect(isKnownCtor(123)).to.be.false;
	});
	it('should return false if an argument is not one of known constructors',() => 
		expect(isKnownCtor(function(){})).to.equal(false)
	);
	it('should return true if an argument is one of known constructors',() => {
		
		expect(isKnownCtor(Model)).to.equal(true)
	});	
	it('should return true if an argument is a custom constructor',() => {
		let NewCtor = function(){};
		knownCtors.push(NewCtor);
		expect(isKnownCtor(NewCtor)).to.equal(true)
	});
});
