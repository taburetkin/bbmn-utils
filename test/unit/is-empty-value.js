import '../setup';
import { isEmptyValue as is} from '../../src';

describe('is-empty-value: ', function(){

	it('should return true if arguent is null or undefined', function(){
		expect(is(null)).to.be.true;
		expect(is(undefined)).to.be.true;
	});
	it('should return true if arguent is NaN', function(){
		expect(is(parseInt('qweqwe'))).to.be.true;		
	});
	it('should return true if arguent is empty string', function(){
		expect(is('')).to.be.true;
	});
	it('should return true if arguent is whitespaced string and allowWhiteSpace options is false', function(){
		expect(is(' ',{ allowWhiteSpace: false })).to.be.true;
	});	
	it('should return false if arguent is whitespaced string and allowWhiteSpace options is true', function(){
		expect(is(' ',{ allowWhiteSpace: true })).to.be.false;
	});	
	it('should return false if arguent is not nullable, empty string or NaN', function(){
		expect(is('asd')).to.be.false;
		expect(is(0)).to.be.false;
		expect(is({})).to.be.false;
		expect(is([])).to.be.false;
	});	
});
