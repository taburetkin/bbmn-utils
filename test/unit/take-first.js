import '../setup';
import { takeFirst } from '../../src';
describe('take-first:', function(){
	it('should return undefined if key is not a string', function(){
		expect(takeFirst(123)).to.be.undefined;
	});
	it('should return undefined if key is an empty string', function(){
		expect(takeFirst('')).to.be.undefined;
	});
	it('should return undefined if key is an empty string', function(){
		expect(takeFirst('')).to.be.undefined;
	});
	it('should return undefined if given key is not found in contexts', function(){
		expect(takeFirst('foo', 1, { bar: 'foo' }, 3)).to.be.undefined;
	});
	it('should return first founded value', function(){
		expect(takeFirst('foo', 1, {foo:'bar'}, 3)).to.be.equal('bar');
	});
});
