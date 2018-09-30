import '../setup';
import { enums, enumsStore } from '../../src';
import { enumsApi, get, has } from '../../src/enums';

describe('enums:', function(){
	describe('API', function(){
		it('should expose `get`', function(){
			expect(enums.get).to.be.a('function');
		});
		it('should expose `set`', function(){
			expect(enums.set).to.be.a('function');
		});
		it('should expose `has`', function(){
			expect(enums.has).to.be.a('function');
		});
	});

	describe(' enumsApi.getEnum:', function(){
		const getEnum = enumsApi.getEnum;
		
		it('should return undefined if given key is empty', function(){
			expect(getEnum()).to.be.undefined;
		});

		it('should return undefined if given key is not an object or string', function(){
			expect(getEnum(123)).to.be.undefined;
		});		

		it('should return given key if it is an object', function(){
			let test = {};
			expect(getEnum(test)).to.be.equal(test);
		});

		it('should return given enum from store by given key ', function(){
			enumsStore.test = {};			
			expect(getEnum('test')).to.be.equal(enumsStore.test);
		});

		it('should internally call enumsApi.getByPath', function(){
			const spyGetByPath = this.sinon.spy(enumsApi, 'getByPath');
			const key = 'test';
			getEnum(key);			
			expect(spyGetByPath).to.be.calledOnce.and.calledWith(enumsStore, key);
		});		

	});

	
	describe(' get: ', function(){
		let testEnum;
		let result;
		let spyGetEnum;
		let spyGetFlag;		
		beforeEach(function(){
			testEnum = enumsStore.test = {
				yes:'its yes',
				no:'its no',
				dontknow:'its dont know'
			};
			spyGetEnum = this.sinon.spy(enumsApi, 'getEnum');
			spyGetFlag = this.sinon.spy(enumsApi, 'getFlag');
		});
		it('should return enumsStore if called without arguments', function(){
			expect(get()).to.be.equal(enumsStore);
		});

		it('should return undefined if called with one argument and there is no such enum in store', function(){
			expect(get('blablabla')).to.be.undefined;
		});
		it('should return undefined if called with arguments and there is no such enum', function(){
			expect(get('blablabla', 'look for key')).to.be.undefined;
		});
		it('should return enum if called with one string argument and there is an enum in the store', function(){
			expect(get('test')).to.be.equal(testEnum);
		});
		it('should return given enum if called with one object argument', function(){
			expect(get(testEnum)).to.be.equal(testEnum);
		});
		it('should internally call enumsApi.getEnum', function(){
			let key = 'test';
			get(key);
			expect(spyGetEnum).to.be.calledOnce.and.calledWith(key);
		});
		it('should internally call enumsApi.getFlag', function(){
			let options = {};
			let key = 'test';
			get(testEnum, key, options);
			expect(spyGetFlag).to.be.calledOnce.and.calledWith(testEnum, key, options);
		});
	});

	describe(' has:', function(){
		let spyHasFlag;
		let spyGetEnum;
		let testEnum;
		const value = 'yes';
		beforeEach(function(){
			testEnum = enumsStore.test = {
				yes:'its yes',
				no:'its no',
				dontknow:'its dont know'
			};
			spyHasFlag = this.sinon.spy(enumsApi, 'hasFlag');
			spyGetEnum = this.sinon.spy(enumsApi, 'getEnum');
		});
		it('should return false if there is no defined enum in store', function(){
			expect(has(undefined, 1)).to.be.false;
		});
		it('should internally call enumsApi.getEnum', function(){
			let key = 'test';
			has(key, value);
			expect(spyGetEnum).to.be.calledOnce.and.calledWith(key);
		});
		it('should internally call enumsApi.hasFlag', function(){
			let options = {};
			let key = 'test';
			has(key, value, options);
			expect(spyHasFlag).to.be.calledOnce.and.calledWith(testEnum, value, options);
		});

	});


	describe('set: ', function(){
		let spySetByPath;
		let spyExtendStore;
		const newenum1 = {
			one:1, thwo:2, three: 3
		}
		const newenum2 = {
			foo:'foo', bar:'bar'
		}		
		beforeEach(function(){
			spySetByPath = this.sinon.spy(enumsApi, 'setByPath');
			spyExtendStore = this.sinon.spy(enumsApi, 'extendStore');
		});
		it('should not call internal setByPath if first argument is not a string', function(){
			enums.set(123123);
			expect(spySetByPath).to.be.not.called;
		});
		it('should not call internal extendStore if first argument is not an object', function(){
			enums.set(123123);
			expect(spyExtendStore).to.be.not.called;
		});
		it('should call internal setByPath if first argument is a string', function(){			
			let value = {};
			let key = 'qweqwe';
			enums.set(key, value);
			expect(spySetByPath).to.be.calledOnce.and.calledWith(enumsStore, key, value);
		});
		it('should call internal extendStore if first argument is an object', function(){			
			let value = {};			
			enums.set(value);
			expect(spyExtendStore).to.be.calledOnce.and.calledWith(value);
		});
		it('should add new enum by key', function(){
			enums.set('test1', newenum1);
			expect(enumsStore.test1).to.be.equal(newenum1);
		});
		it('should extend store with given hash', function(){
			enums.set({ test2: newenum2 });
			expect(enumsStore.test2).to.be.equal(newenum2);
		});		
	});

});
