import '../setup';
import { buildByKey } from '../../src/index.js';
import getByKey, { isCtor } from '../../src/build-by-key/get-by-key.js';
import { MnObject, isClass, Collection, Model } from 'bbmn-core';

describe('buildByKey: ', function(){

	describe('internal getByKey: ', function(){
		describe('internal isCtor:', function(){
			const checkCtor = ctor => isClass(ctor, MnObject);
			it('should return false if there is no arguments', function(){
				expect(isCtor()).to.be.false;
			});
			it('should return false if instance is not a function', function(){
				expect(isCtor({})).to.be.false;
				expect(isCtor('asd')).to.be.false;
				expect(isCtor(123)).to.be.false;
			});
			it('should return false if instance is not a given ctor', function(){
				expect(isCtor(function(){}, MnObject)).to.be.false;
			});
			it('should return true if instance is a given ctor', function(){
				expect(isCtor(MnObject.extend({}), MnObject)).to.be.true;
			});
			it('should return false if checkCtor return not true', function(){
				expect(isCtor(function(){}, null, checkCtor)).to.be.false;
			});
			it('should return true if checkCtor return true', function(){
				expect(isCtor(MnObject, null, checkCtor)).to.be.true;
			});
			it('should return true because its a knownCtor', function(){
				expect(isCtor(MnObject)).to.be.true;
			});
		});

		let context;
		const testObject = {};
		const testOptions = { bar: 'baz' };
		beforeEach(function(){
			context = {
				options:{
					objKey: testObject,
					strKey: 'foo',
					strKeyOptions: testOptions,
					numKey: () => 123,					
				},
				key: MnObject,
				keyOptions: testOptions,
			}
		});

		it('should invoke property with given invokeContext and invokeArguments', function(){
			const invokeContext = {
				d: 4
			};
			const invokeArguments = [1,2,3];
			const anotherContext = {
				key(a,b,c){
					return a + b + c + this.d;
				},
				keyOptions(a,b,c){
					if (a + b + c + this.d === 10) {
						return invokeContext;
					}
				}
			}
			let result = getByKey(anotherContext, 'key', { invokeContext, invokeArguments });

			expect(result).to.have.property('value', 10);
			expect(result).to.have.deep.property('options', { d:4 });
		});

		it('should return undefined if key is not a string', function(){
			expect(getByKey()).to.be.undefined;
			expect(getByKey({}, null)).to.be.undefined;
			expect(getByKey({}, 123)).to.be.undefined;
			expect(getByKey({}, {})).to.be.undefined;
			expect(getByKey({}, [])).to.be.undefined;
			expect(getByKey({}, () => {})).to.be.undefined;
		});

		it('should return object if key is found', function(){
			expect(getByKey(context, 'strKey')).to.be.a('object');
			expect(getByKey(context, 'key')).to.be.a('object');
			expect(getByKey(context, 'objKey')).to.be.a('object');
		});

		it('should return undefined if key is not found', function(){
			expect(getByKey(context, 'some-not-exist-key')).to.be.undefined;
		});		

		it('should return object with filled `value` if keyValue is not a constructor', function(){
			expect(getByKey(context, 'numKey')).to.be.a('object').that.has.property('value');
			expect(getByKey(context, 'strKey')).to.be.a('object').that.has.property('value');
		});
		it('should return object with filled `definition` if keyValue a constructor', function(){
			expect(getByKey(context, 'numKey')).to.be.a('object').that.has.property('value');
			expect(getByKey(context, 'strKey')).to.be.a('object').that.has.property('value');
			expect(getByKey(context, 'key')).to.be.a('object').that.has.property('definition');
		});
		it('should merge options', function(){
			let result = getByKey(context, 'strKey', { options: { baz: 123 } });
			expect(result.options).to.be.a('object').that.has.property('bar');
			expect(result.options).to.be.a('object').that.has.property('baz');
		});
	});

	let context;
	const testModel = new Model();
	beforeEach(function(){
		context = {
			model: Model,
			collection: Collection,
			collectionOptions: { parse: 'true' },			
			instance: () => testModel,
			number: 123,
			obj: {}
		}
	});

	it('should return undefined if key is not a string', function(){
		expect(buildByKey()).to.be.undefined;
		expect(buildByKey(context)).to.be.undefined;
		expect(buildByKey(context, () => {})).to.be.undefined;
		expect(buildByKey(context, [1,2])).to.be.undefined;
		expect(buildByKey(context, {})).to.be.undefined;
		expect(buildByKey(context, 1)).to.be.undefined;
	});

	it('should return model instance without options', function(){
		expect(buildByKey(context, 'model')).to.be.instanceOf(Model);
	});

	it('should return collection instance with options and given models', function(){
		let models = [ new Model() ];
		let options = {
			toArguments: (cnt, def, options) => [models, options]
		}
		let result = buildByKey(context, 'collection', options);
		expect(result).to.be.instanceOf(Collection);
		expect(result.first()).to.be.equal(models[0]);
	});	
	it('should return instance without changes if keyValue is instance', function(){
		let result = buildByKey(context, 'instance', { ctor: Model });
		expect(result).to.be.equal(testModel);
	});
	it('should return undefined if keyValue is not an object and there is no buildText', function(){
		let result = buildByKey(context, 'number');
		expect(result).to.be.undefined;
	});	
	it('should build instance from value if buildText is supplied', function(){
		let Fn = function(num){
			this.value = num;
		}
		let result = buildByKey(context, 'number', { buildText: val => new Fn(val) });
		expect(result).to.be.instanceOf(Fn);
	});	
	it('should return undefined if value is an object and its not instanceof given ctor', function(){
		let Fn = function(num){
			this.value = num;
		}
		let result = buildByKey(context, 'obj', { ctor: Fn });
		expect(result).to.be.undefined;
	});	
});
