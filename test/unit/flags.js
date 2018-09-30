import '../setup';
import { normalizeStringArray, normalizeArgument } from '../../src/flags/helpers';
import { getFlag, hasFlag } from '../../src';

describe('flags: ', function(){

	describe('private api: ', function(){
		describe('normalizeStringArray', function(){

			it('should return empty array if given argument is empty', function(){
				expect(normalizeStringArray()).to.be.an('array').that.is.empty;
			});
			it('should return empty array if given argument is array of nullable things', function(){
				expect(normalizeStringArray([null, undefined])).to.be.an('array').that.is.empty;
			});
			it('should return string array', function(){
				let arr = normalizeStringArray([1, {}, [], function(){}]);
				let result = _.every(arr, i => _.isString(i));
				expect(result).to.be.true;
			});
		});		
	});


	describe('has-flag',function(){
		describe('when both is number',function(){
			const checkFive = 5;
			const againstZero = 0;
			const againstOne = 1;
			const againstTwo = 2;
			const againstThree = 3;
			const againstFour = 4;
			const againstFive = 5;
	
			it('should return true if `value & argument` greater than 0 and `all` option is not set', function(){
				expect(hasFlag(checkFive, againstOne)).to.be.true;
				expect(hasFlag(checkFive, againstFour)).to.be.true;
			});
	
			it('should return false if `value & argument` not equals argument and `all` option is true', function(){
				expect(hasFlag(checkFive, againstThree, { all: true })).to.be.false;
			});
	
			it('should return true if `value & argument` equals argument and `all` option is true', function(){
				expect(hasFlag(checkFive, againstFive, { all: true })).to.be.true;
			});
	
			it('should return false if argument bits is not inside checkvalue', function(){
				expect(hasFlag(checkFive, againstTwo)).to.be.false;
				expect(hasFlag(checkFive, againstZero)).to.be.false;
			});
		});
		describe('when one of arguments is number while other is not',function(){
			const num = 5;
			const text = '5';
			it('should return false', function(){
				expect(hasFlag(num, text)).to.be.false;
				expect(hasFlag(text, num)).to.be.false;
			});
		});
		describe('when both is strings',function(){
			
			it('should be case insensitive', function(){
				expect(hasFlag('AbC', 'abc')).to.be.true;
			});
	
			it('should return false if no values present in check', function(){
				expect(hasFlag('foo, bar', 'baz')).to.be.false;
			});
	
	
			it('should return true if some values present in check and `all` is not true', function(){
				expect(hasFlag('one, three, Four', 'five, four')).to.be.true;
			});
	
			it('should return false if some values present in check and `all` is true', function(){
				expect(hasFlag('one, three, four', 'five, four', { all: true })).to.be.false;
			});
	
		});
		describe('when flag is array',function(){
			
			it('should be case insensitive', function(){
				expect(hasFlag('AbC', ['abc'])).to.be.true;
			});
			it('should return false if caseSensitive is true', function(){
				expect(hasFlag('AbC', ['abc'], { caseSensitive: true })).to.be.false;
			});
	
	
			it('should return false if no values present in check', function(){
				expect(hasFlag('foo, bar', ['baz'])).to.be.false;
			});
	
	
			it('should return true if some values present in check and `all` is not true', function(){
				expect(hasFlag('one, three, Four', ['five','four'])).to.be.true;
			});
	
			it('should return false if some values present in check and `all` is true', function(){
				expect(hasFlag('one, three, four', ['five', 'four'], { all: true })).to.be.false;
			});
	
		});
		describe('when check is object and useObjectValues is not true',function(){
			const check = {
				one: 'one',
				two: 'two',
				Three: 'Three',
				four: 'four',
			}
			it('should be case insensitive by default', function(){
				expect(hasFlag(check, 'three')).to.be.true;
			});
	
			it('should return false if no values present in check', function(){
				expect(hasFlag(check, ['baz'])).to.be.false;
			});
	
	
			it('should return true if some values present in check and `all` is not true', function(){
				expect(hasFlag(check, 'five,four')).to.be.true;
			});
	
			it('should return false if some values present in check and `all` is true', function(){
				expect(hasFlag(check, ['five', 'four'], { all: true })).to.be.false;
			});
	
		});
		describe('when check is object and useObjectValues is true',function(){
			const check = {
				_one: 'one',
				_two: 'two',
				_Three: 'Three',
				_four: 'four',
			}
			const options = { useObjectValues: true };
			it('should be case insensitive', function(){
				expect(hasFlag(check, 'three', options)).to.be.true;
			});
	
			it('should return false if no values present in check', function(){
				expect(hasFlag(check, ['baz'], options)).to.be.false;
			});
	
	
			it('should return true if some values present in check and `all` is not true', function(){
				expect(hasFlag(check, 'five,four', options)).to.be.true;
			});
	
			it('should return false if some values present in check and `all` is true', function(){
				expect(hasFlag(check, ['five', 'four'], _.extend({ all: true }, options))).to.be.false;
			});
	
		});		
	});	

	describe('get-flag: ', function(){
		describe('when wrong arguments suplied', function(){
			it('should return undefined if returnAs is unknown', function(){
				expect(getFlag('1, 2, 3', '1', { returnAs: 'something' })).to.be.undefined;
			});
			it('should return undefined if there is wrong arguments', function(){
				expect(getFlag()).to.be.undefined;
				expect(getFlag(undefined, undefined)).to.be.undefined;
				expect(getFlag('asd', undefined)).to.be.undefined;
				expect(getFlag(undefined, 'asd')).to.be.undefined;
				expect(getFlag('qwe', '')).to.be.undefined;
				expect(getFlag('', 'qwe')).to.be.undefined;	
			});
		});
	
		describe('when string value and string flag', function(){
			const stringValue = 'One, Two, Three';
			beforeEach(function(){
	
			});
			it('should return founded values by flags set', function(){
				expect(getFlag(stringValue, 'one, three')).to.be.equal('One, Three');
			});
			it('should return undefined if all set to tru and not all flags suplied', function(){
				expect(getFlag(stringValue, 'one, three', { all: true })).to.be.undefined;
			});
			it('should return undefined if caseSensitive set to true', function(){
				expect(getFlag(stringValue, 'one, three', { caseSensitive: true })).to.be.undefined;
			});
			it('should return object if returnAs is `object`', function(){
	
				expect(getFlag(stringValue, 'one', { returnAs: 'object' })).to.be.eql({'0':'One'});
			});
		});
	
		describe('when string value and array flag', function(){
			const stringValue = 'One, Two, Three';
			beforeEach(function(){
	
			});
			it('should return founded values array by flags set', function(){
				expect(getFlag(stringValue, ['one', 'three'])).to.be.eql(['One', 'Three']);
			});
			it('should return undefined if all set to tru and not all flags suplied', function(){
				expect(getFlag(stringValue, ['one', 'three'], { all: true })).to.be.undefined;
			});		
		});
		describe('when array value', function(){
			const vakue = ['one', 'two', 'three'];
			it('should return founded values array by flags set', function(){
				expect(getFlag(vakue, ['one', 'three'])).to.be.eql(['one', 'three']);
			});
			it('should return founded values string', function(){
				expect(getFlag(vakue, 'one, three')).to.be.equal('one, three');
			});		
		});	
	
		describe('when object value and string flag', function(){
			const value = {
				one: 'Uno',
				two: 'Duo',
				three: 'Tres'
			}
			it('should return founded values as string', function(){
				expect(getFlag(value, 'one, three')).to.be.equal('Uno, Tres');
			});
	
			describe(' and option takeObjectKeys is true ', function(){
				it('should return founded keys as string', function(){
					expect(getFlag(value, 'one, three', { takeObjectKeys: true })).to.be.equal('one, three');
				});
				describe(' and option useObjectValues is true ', function(){
					it('should return founded values as string', function(){
						expect(getFlag(value, 'Uno, Tres', { useObjectValues: true, takeObjectKeys: true })).to.be.equal('one, three');
					});
				});
			});
	
			describe(' and option useObjectValues is true ', function(){
				it('should return founded values as string', function(){
					expect(getFlag(value, 'Uno, Tres', { useObjectValues: true })).to.be.equal('Uno, Tres');
				});
			});
	
			describe(' and returnAs is `object`', function(){
				let options;
				
				beforeEach(function(){
					options = { returnAs: 'object' };
				});
	
				it('should return object', function(){
					expect(getFlag(value, 'one', options)).to.be.eql({ one:'Uno' });
				});
	
				it('should return reversed object whene takeObjectKeys and useObjectValues are true', function(){
					options.takeObjectKeys = true;
					options.useObjectValues = true;
					expect(getFlag(value, 'Uno', options)).to.be.eql({ Uno:'one' });
				});
				
			});
	
		});
	
		describe('when object value and array flag', function(){
			const value = {
				one: 'One',
				two: 'Two',
				three: 'Three'
			}
			it('should return founded values as array', function(){
				expect(getFlag(value, ['one', 'three'])).to.be.eql(['One', 'Three']);
			});
	
			describe(' and option takeObjectKeys is true ', function(){
				it('should return founded keys as array', function(){
					expect(getFlag(value, ['one', 'three'], { takeObjectKeys: true })).to.be.eql(['one', 'three']);
				});
			});
	
		});
	
	});
	

});
