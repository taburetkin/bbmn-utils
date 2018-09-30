import '../setup';
import { mergeObjects } from '../../src';

describe('merge-objects: ', function(){
	it('should return object in any case', function(){
		expect(mergeObjects()).to.be.an('object');
		expect(mergeObjects(1,2)).to.be.an('object');
		expect(mergeObjects({},{},{})).to.be.an('object');
	});
	it('should merge multiple arguments', function(){
		let result = mergeObjects({ a: 1 }, { b: 2 }, { c: 3 });
		expect(result).to.be.an('object');
		expect(_.size(result)).to.be.equal(3);
		expect(result.a).to.be.equal(1);
		expect(result.b).to.be.equal(2);
		expect(result.c).to.be.equal(3);
	});

	it('should override arrays', function(){
		let arr1 = [1,2];
		let arr2 = [3,4];
		let result = mergeObjects({ a: arr1 }, { a: arr2  });
		expect(result.a).to.be.eql(arr2);
	});

	it('should merge deep objects', function(){
		let result = mergeObjects({ a: 1, b: { a:1, b: 1 } }, { b: { b: 2, c: 3 }  });
		expect(result.b.b).to.be.equal(2);
		expect(result.b.c).to.be.equal(3);
	});

});
