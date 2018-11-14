import '../setup';
import { compareObjects, flat } from '../../src';
import { Model } from 'bbmn-core';

describe('compareObjects', function(){
	it('when arguments are not objects should apply strict equal', function(){
		expect(compareObjects(1,2)).to.be.false;
		expect(compareObjects('abc','abc')).to.be.true;
	});
	
	it('when arguments are of different types should return false', function(){
		expect(compareObjects({}, () => {})).to.be.false;
		expect(compareObjects([],{})).to.be.false;
	});
	it('when objects keys do not match should return false', function(){
		expect(compareObjects({},{ a: 1 })).to.be.false;		
	});
	it('when there is no actual values should return true', function(){
		expect(compareObjects({},{ a: undefined })).to.be.true;		
	});	
	it('when objects keys and values mathced should return true', function(){
		expect(compareObjects(() => {}, () => {})).to.be.false;
		expect(compareObjects({ a: 'foo', b:'bar' },{ b: 'bar', a:'foo' })).to.be.true;	
		expect(compareObjects({ b:123 },{ a: 123 })).to.be.false;
	});	
	it('when arrays length are differs should return false', function(){
		expect(compareObjects([1,1], [1])).to.be.false;
	});		
	it('when arrays length are the same and values has doubles shuold return false', function(){
		expect(compareObjects([1, 1, 2, 2, 3], [1,2,3,3,3])).to.be.false;
	});		
	it('when arrays values and length the same should return true', function(){
		expect(compareObjects([3, 1, 2, 4], [4,2,1,3])).to.be.true;
	});	
	it('when there is a nested objects in an array and they do not match should return false', function(){
		expect(compareObjects([3, 1, 2, 4, {a: 1, b: 2 }], [4,2,1,3, { b: 2 }])).to.be.false;
	});	
	it('when there is a nested objects in an array and they are match should return true', function(){
		expect(compareObjects([3, 1, 2, 4, {a: 1, b: 2 }], [4,2,1,3, { b: 2, a: 1 } ])).to.be.true;		
	});	
	it('when there is a nested arrays in an object and they do not match should return false', function(){
		expect(compareObjects([3, 1, 2, 4, {a: 1, b: 2 }], [4,2,1,3, { b: 2 }])).to.be.false;
	});	
	it('when there is a nested arrays in an object and they are match should return true', function(){
		let a = {
			a:1,
			b:2,
			c: [3, 1, 2, 4, {a: 1, b: 2 }]
		}
		let b = {
			c: [4,2,1,3, { b: 2, a: 1 } ],
			a: 1,
			b: 2
		}
		expect(compareObjects(a, b)).to.be.true;		
	});	
	it('when there is a nested arrays in an object and they do not match should return false', function(){
		let a = {
			a:1,
			b:2,
			c: [3, 1, 2, 4, {a: 1, b: 2 }]
		}
		let b = {
			c: [4, 2, 1, 3, 5, { b: 2, a: 1 } ],
			a: 1,
			b: 2
		}
		expect(compareObjects(a, b)).to.be.false;
	});
	it('when comparing same object', function(){
		let test = {a:1, b: { b:2 } };
		expect(compareObjects(test, test)).to.be.true;
	});
	it('when comparing backbone models', function(){
		let a = new Model({id:1});
		let b = new Model();
		expect(compareObjects(a, b)).to.be.false;
	});	
	it('when comparing objects with circular references', function(){
		let a = {a:1, b: { b:2 } };
		let b = {a:1, b: { b:2 } };
		a.c = b;
		b.c = a;
		expect(compareObjects(a, b)).to.be.true;
	});		
});
