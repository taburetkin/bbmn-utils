
import '../setup.js';
import { betterResult as result } from '../../src/index.js';

describe('better-result: ',function(){
	let testFunc = () => 'from function';
	let testContext = function(){ return this.name };
	let checkAlso = {
		name:'checkAlso',
		baz:'also baz',
		testContext
	}
	let obj = {
		name:'test',
		foo:'bar',
		bar: testFunc,
		testContext,
		argumentCount: (...args) => args.length,
		argumentValue: a => a
	}

	it('should return undefined if object is undefined', function(){
		expect(result(undefined,'foo')).to.be.undefined;
	});

	it('should return value by key in simple case',() => {
		expect(result(obj,'foo')).to.equal('bar')
	});

	it('should return function value if force is not set',() => {
		expect(result(obj,'bar')).to.equal('from function')
	});

	it('should return function value if force is true',() => {
		expect(result(obj,'bar', { force: true })).to.equal('from function')
	});

	it('should return function if force set to false',() => {
		expect(result(obj,'bar', {force: false})).to.equal(testFunc)
	});
	
	it('should return default value if set',() => {
		expect(result(obj,'barrrr', {default: 'default value'})).to.equal('default value')
	});	

	it('should check checkAlso if it set',() => {
		expect(result(obj,'baz', { checkAlso })).to.equal('also baz')
	});

	it('should apply object as context for function invocaion',() => {
		expect(result(obj,'testContext')).to.equal('test');
		expect(result(obj,'testContext', { checkAlso })).to.equal('test');
	});		

	it('should supply arguments for function invocaion',() => {
		expect(result(obj,'argumentCount',{args:['','','','']})).to.equal(4);
		expect(result(obj,'argumentValue',{args:['argument']})).to.equal('argument');
	});		

	it('should return undefined if key is not a string or an empty string', function(){
		expect(result(obj, undefined)).to.be.undefined;
	});

});
