import '../setup';
import { convertString, toNumber } from '../../src';
import converters from '../../src/convert-string/converters';

describe('convertString: ', function(){

	it('when type is not a string should throw error', function(){
		expect(convertString).to.throw('type should be a string');
	});
	it('when type converter is not a function should throw error', function(){
		expect(convertString.bind(null, '', 'fake')).to.throw('string converter fake is not a function');
	});

	describe('when converter exists', function(){
		let testOptions;
		let testValue;
		let stubConvrter;
		let result;
		const returnValue = 'my value';
		beforeEach(function(){
			let converterName = 'test';
			stubConvrter = this.sinon.spy(() => returnValue);

			converters[converterName] = stubConvrter;
			testOptions = { foo: 'bar' }
			testValue = 'given value';

			result = convertString(testValue, converterName, testOptions);
		});
		it('should call converter with given value and options', function(){
			expect(stubConvrter).to.be.calledOnce.and.calledWith(testValue, testOptions);
		});
		it('should return converter result', function(){
			expect(result).to.be.equal(returnValue);
		});
	});

});

describe('toNumber: ', function(){
	it('if given argument is not NaN number should return it', function(){
		expect(toNumber(1)).to.be.equal(1);
	});
	it('if given argument is null should return undefined', function(){
		expect(toNumber(null)).to.be.undefined;
	});
	it('if given argument is NaN should return undefined', function(){
		expect(toNumber(parseInt('qwe'))).to.be.undefined;
	});
	it('if given argument is not a string should return undefined', function(){
		expect(toNumber({})).to.be.undefined;
	});
	it('if given argument is string and parse return not a number should return undefined', function(){
		expect(toNumber('qwe')).to.be.undefined;
	});
	it('if given argument is string and parse return a number should return it', function(){
		expect(toNumber('123.456')).to.be.equal(123.456);
	});

});
