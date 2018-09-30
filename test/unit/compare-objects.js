import '../setup';
import { compareObjects } from '../../src';

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
		expect(compareObjects({},{ a: undefined })).to.be.false;		
	});
	it('when objects keys and values mathced should return true', function(){
		expect(compareObjects(() => {}, () => {})).to.be.true;
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
});
