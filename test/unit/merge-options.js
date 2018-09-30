import '../setup';
import { mergeOptions } from '../../src';

describe('merge-options:', function(){
	let instance;
	const call = (...args) => instance.mergeOptions(...args);
	const options = {
		foo:'foo',
		bar:'bar',
		baz:'baz',
		nullable: null,
		undef: undefined
	}
	beforeEach(function(){
		instance = {
			mergeOptions
		}
	});

	it('should not process options if its not an object', function(){
		expect(call(null)).to.be.undefined;
	});
	it('should return object if given argument is object', function(){
		expect(call({})).to.be.an('object');
	});
	it('should merge options by key arrays', function(){
		call(options, ['foo', 'bar']);
		expect(instance.foo).to.be.equal('foo');
		expect(instance.bar).to.be.equal('bar');
	});	
	it('should skip undefined values', function(){
		instance.undef = 123;
		call(options, ['undef']);
		expect(instance.undef).to.be.equal(123);		
	});	
	it('should skip not string keys', function(){
		let result = call(options, [123]);
		expect(result).to.be.an('object');
		expect(_.size(result)).to.be.equal(0);
	});	
	it('should merge multiple arrays', function(){
		let result = call(options, ['foo'], ['bar']);
		expect(result).to.be.an('object');
		expect(_.size(result)).to.be.equal(2);
		expect(instance.foo).to.be.equal('foo');
		expect(instance.bar).to.be.equal('bar');
	});
	it('should merge spreaded keys', function(){
		let result = call(options, 'foo', 'bar');
		expect(result).to.be.an('object');
		expect(_.size(result)).to.be.equal(2);
		expect(instance.foo).to.be.equal('foo');
		expect(instance.bar).to.be.equal('bar');
	});		
});
