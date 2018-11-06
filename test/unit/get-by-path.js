import '../setup';
import { getByPath } from '../../src/index.js';
import getByPathArray from '../../src/get-by-path/get-by-path-array';
import getProperty from '../../src/get-by-path/get-property';
import { Model } from 'backbone';
describe('get-by-path',function(){
	
	it('should return undefined if context is not object',() => {
		expect(getByPath(null, 'path.path')).to.undefined;
		expect(getByPath(undefined, 'path.path')).to.undefined;
		expect(getByPathArray(null)).to.be.undefined;
		expect(getProperty(null)).to.be.undefined;
	});

	it('should return undefined if path is empty',() => {
		expect(getByPath({a:'a'}, '')).to.undefined;
	});	

	it('should return undefined if path is not exists',() => {
		expect(getByPath({a:'a'}, 'path.path')).to.undefined;
	});	
	
	it('should return undefined if path is incorrect',() => {
		expect(getByPath({a:'a'}, {})).to.undefined;
	});	

	it('should return value if path is exists',() => {
		expect(getByPath({foo:{bar:{baz:'test value'}}}, 'foo.bar.baz')).to.equal('test value');
		expect(getByPath({foo:{bar:{baz:'test value'}}}, ['foo','bar','baz'])).to.equal('test value');
	});

	describe('when context is backbone model', function(){
		let model;
		let test;
		beforeEach(function(){
			model = new Model({
				inAttr: 'abc',
				number: 123,
				nested: {
					foo: 'bar'
				}
			});
			model.inInstance = 'hello';
			model.number = 321;
			model.parent = 'baz';
			model.nested = { baz:'baz' };
			test = (key, options) => getByPath(model, key, options);
		});
		it('should return model attribute value by default', function(){
			expect(test('number')).to.be.equal(123);
		});
		it('should respect noModelAttributes option, skipping model attributes lookup', function(){
			expect(test('inAttr', { noModelAttributes: true })).to.be.undefined;
		});
		it('should respect includeModelProperties option, adding to lookup model property', function(){
			expect(test('inInstance', { includeModelProperty: true })).to.be.equal('hello');
		});
		it('should return attribute value by default if includeModelProperties is true', function(){
			expect(test('number', { includeModelProperty: true })).to.be.equal(123);
		});		
		it('should respect modelPropertyFirst option, check property value in first', function(){
			expect(test('number', { modelPropertyFirst: true })).to.be.equal(321);
			expect(test('inAttr', { modelPropertyFirst: true })).to.be.equal('abc');
		});
		it('should respect modelPropertyFirst option for nested objects too', function(){
			expect(test('nested.foo', { modelPropertyFirst: true })).to.be.undefined;
			expect(test('nested.baz', { modelPropertyFirst: true })).to.be.equal('baz');
		});
	});


});
