import '../setup';
import { skipTake } from '../../src';

describe('skip-take: ', function(){

	it('should throw error if skip argument is not a number', function(){
		expect(skipTake.bind(null, [], 0, 'abc')).to.throw();
	});

	it('should throw error if take argument is not a number', function(){
		expect(skipTake.bind(null, [], 'abc', 0)).to.throw();
	});
	
	it('should return undefined is given argument is not an object', function(){
		expect(skipTake()).to.be.undefined;
		expect(skipTake(123)).to.be.undefined;
	});

	it('should return 2,3 arguments from object', function(){
		expect(skipTake({a:1, b:2, c:3, d:4}, 2, 1)).to.be.eql([2, 3]);
	});	

	it('should return rest values if skip + take > length', function(){
		expect(skipTake([1,2,3,4,5,6,7], 100, 5)).to.be.eql([6, 7]);
	});	

});
